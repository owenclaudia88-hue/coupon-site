import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const PASSWORD = process.env.SHIELD_LOG_PASSWORD || "shieldpass123";
const REDIS_KEY = "shield_logs";
const COOKIE_NAME = "shield_auth";
// Simple hash of password for cookie value (not the raw password)
function authToken() {
  let h = 0;
  const s = "shield:" + PASSWORD;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return "tk_" + (h >>> 0).toString(36);
}

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME);
  return cookie?.value === authToken();
}

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const NO_INDEX_HEADERS: Record<string, string> = {
  "content-type": "text/html",
  "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
  "cache-control": "no-store, no-cache, must-revalidate, private",
};

// POST — receive log entry from middleware OR handle login form
export async function POST(req: NextRequest) {
  // Middleware log entry
  if (req.headers.get("x-mw") === "1") {
    try {
      const entry = await req.json();
      const redis = getRedis();
      await redis.rpush(REDIS_KEY, JSON.stringify(entry));
      if (entry.verdict === "blocked") {
        await autoDynamicBlock(entry, redis);
      }
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      console.error("[shield-log] POST error:", e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Login form submission
  try {
    const formData = await req.formData();
    const action = formData.get("action");

    // Login
    if (action === "login") {
      const pw = formData.get("pw") as string;
      if (pw === PASSWORD) {
        const res = NextResponse.redirect(new URL("/api/shield-log", req.url), { status: 303 });
        res.cookies.set(COOKIE_NAME, authToken(), {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/api/shield-log",
          maxAge: 60 * 60 * 24, // 24 hours
        });
        return res;
      }
      // Wrong password — show login with error
      return new NextResponse(loginHTML("Wrong password"), { headers: NO_INDEX_HEADERS });
    }

    // Logout
    if (action === "logout") {
      const res = NextResponse.redirect(new URL("/api/shield-log", req.url), { status: 303 });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }

    // Clear logs
    if (action === "clear" && isAuthed(req)) {
      const redis = getRedis();
      await redis.del(REDIS_KEY);
      return NextResponse.json({ ok: true });
    }

    // Dynamic blocklist management
    if (isAuthed(req) && action) {
      const redis = getRedis();
      const type = formData.get("type") as string;
      const value = formData.get("value") as string;
      const keyMap: Record<string, string> = {
        ip: "shield_dynamic_ips",
        asn: "shield_dynamic_asns",
        snippet: "shield_dynamic_snippets",
      };

      if (action === "dynamic-remove" && type && value && keyMap[type]) {
        await redis.srem(keyMap[type], value);
        await redis.rpush("shield_dynamic_audit", JSON.stringify({
          ts: Date.now(), action: "manual-remove", type, value,
          trigger_reason: "manual", trigger_ip: "", trigger_asn: "", trigger_isp: "",
        }));
        return NextResponse.json({ ok: true });
      }
      if (action === "dynamic-add" && type && value && keyMap[type]) {
        await redis.sadd(keyMap[type], value.trim());
        await redis.rpush("shield_dynamic_audit", JSON.stringify({
          ts: Date.now(), action: "manual-add", type, value: value.trim(),
          trigger_reason: "manual", trigger_ip: "", trigger_asn: "", trigger_isp: "",
        }));
        return NextResponse.json({ ok: true });
      }
      if (action === "dynamic-clear" && type && keyMap[type]) {
        await redis.del(keyMap[type]);
        return NextResponse.json({ ok: true });
      }

      if (action === "dynamic-enrich-asns") {
        const ips = (await redis.smembers("shield_dynamic_ips")) as string[];
        const existingAsns = new Set((await redis.smembers("shield_dynamic_asns")) as string[]);
        const token = process.env.IPINFO_TOKEN;
        if (!token) return NextResponse.json({ error: "No IPINFO_TOKEN" }, { status: 500 });

        let added = 0;
        // Process in batches of 10 to avoid timeout
        const BATCH = 10;
        for (let i = 0; i < ips.length; i += BATCH) {
          const batch = ips.slice(i, i + BATCH);
          const results = await Promise.all(batch.map(ip => ipinfoForDynamic(ip)));
          const pipeline = redis.pipeline();
          for (let j = 0; j < batch.length; j++) {
            const { asn } = results[j];
            if (asn && !existingAsns.has(asn)) {
              pipeline.sadd("shield_dynamic_asns", asn);
              pipeline.rpush("shield_dynamic_audit", JSON.stringify({
                ts: Date.now(), action: "auto-add", type: "asn", value: asn,
                trigger_reason: "enrich-backfill", trigger_ip: batch[j], trigger_asn: asn, trigger_isp: results[j].isp,
              }));
              existingAsns.add(asn);
              added++;
            }
          }
          await pipeline.exec();
        }
        return NextResponse.json({ ok: true, added });
      }
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  return NextResponse.json({ error: "bad request" }, { status: 400 });
}

// DELETE — clear all logs (authed by cookie)
export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const redis = getRedis();
    await redis.del(REDIS_KEY);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET — serve login page, log viewer, or JSON data
export async function GET(req: NextRequest) {
  // Not authed — show login form
  if (!isAuthed(req)) {
    return new NextResponse(loginHTML(), { headers: NO_INDEX_HEADERS });
  }

  // Authed — serve JSON data
  const url = new URL(req.url);

  if (url.searchParams.get("format") === "dynamic") {
    try {
      const redis = getRedis();
      const [ips, asns, snippets, auditRaw] = await Promise.all([
        redis.smembers("shield_dynamic_ips"),
        redis.smembers("shield_dynamic_asns"),
        redis.smembers("shield_dynamic_snippets"),
        redis.lrange("shield_dynamic_audit", -100, -1),
      ]);
      const audit = ((auditRaw || []) as string[]).map((r) => {
        try { return typeof r === "string" ? JSON.parse(r) : r; } catch { return r; }
      }).reverse();
      return NextResponse.json({ ips: ips || [], asns: asns || [], snippets: snippets || [], audit });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  if (url.searchParams.get("format") === "json") {
    try {
      const redis = getRedis();
      const raw: string[] = await redis.lrange(REDIS_KEY, 0, -1);
      const logs = raw.map((r) => {
        try { return typeof r === "string" ? JSON.parse(r) : r; }
        catch { return r; }
      });
      return NextResponse.json(logs);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Authed — serve viewer
  return new NextResponse(buildViewerHTML(), { headers: NO_INDEX_HEADERS });
}

/* ========= Dynamic blocklist auto-add ========= */

const SKIP_SNIPPETS_EXACT = new Set([
  "internet", "network", "networks", "telecom", "telecommunications",
  "broadband", "fiber", "fibre", "cable", "wireless", "mobile",
  "communications", "communication", "services", "service",
  "solutions", "systems", "technology", "technologies",
  "llc", "inc", "ltd", "corp", "corporation", "company", "co",
  "group", "holding", "holdings", "global", "international",
  "national", "regional", "local", "isp", "asp", "net", "org", "com",
  "data", "hosting", "cloud", "server", "servers", "provider", "providers",
  "access", "ip", "as", "asn", "unknown", "private", "reserved",
  "digital", "online", "media", "plus", "connect", "connected",
  "limited", "plc", "gmbh", "bv", "ab", "sa", "srl", "sas", "oy", "ag", "nv",
]);

const SKIP_SNIPPETS_CONTAINS = [
  "internet", "network", "telecom", "broadband", "wireless", "mobile",
  "communications", "hosting", "cloud", "provider", "service",
];

function isSafeSnippet(name: string): boolean {
  const s = name.toLowerCase().trim();
  if (s.length < 5) return false;
  if (s.includes(",")) return false; // "amazon.com, inc." style — too broad
  if (s.includes(".")) return false; // domain names — too specific/fragile
  if (SKIP_SNIPPETS_EXACT.has(s)) return false;
  for (const forbidden of SKIP_SNIPPETS_CONTAINS) {
    if (s.includes(forbidden)) return false;
  }
  return true;
}


async function ipinfoForDynamic(ip: string): Promise<{ asn: string; isp: string }> {
  const token = process.env.IPINFO_TOKEN;
  if (!token || !ip) return { asn: "", isp: "" };
  try {
    const res = await fetch(
      `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(1500), cache: "no-store" }
    );
    if (!res.ok) return { asn: "", isp: "" };
    const j = await res.json();
    return { asn: (j.asn || "").toUpperCase(), isp: (j.as_name || "").toLowerCase() };
  } catch {
    return { asn: "", isp: "" };
  }
}

async function autoDynamicBlock(entry: Record<string, any>, redis: ReturnType<typeof getRedis>) {
  try {
    const reason: string = entry.reason || "";
    const ip: string = (entry.ip || "").trim();
    let asn: string = (entry.asn || "").toUpperCase().trim();
    let isp: string = (entry.isp || "").toLowerCase().trim();

    // Never cascade on these
    if (!reason || reason === "allowed") return;
    if (reason.startsWith("country")) return;
    if (reason.startsWith("dynamic_")) return;
    if (reason === "no_ip") return;
    if (reason.startsWith("suspicious_") || reason.startsWith("proxy_header") || reason === "suspicious_accept") return;

    // For early blocks (bot_ua, cidr) IPinfo hasn't run yet — look it up now to get ASN
    const needsLookup = (reason === "bot_ua" || reason === "cidr") && !asn && ip;
    if (needsLookup) {
      const info = await ipinfoForDynamic(ip);
      asn = info.asn;
      isp = info.isp;
    }

    const toAdd: Array<{ key: string; value: string; type: string }> = [];

    // Always add IP for any confirmed block
    if (ip) toAdd.push({ key: "shield_dynamic_ips", value: ip, type: "ip" });

    // For all block types: add ASN if available
    if (asn) toAdd.push({ key: "shield_dynamic_asns", value: asn, type: "asn" });

    if (reason.startsWith("bad_asn:")) {
      // ASN match — also add ISP snippet to catch related ASNs in future
      if (isp && isSafeSnippet(isp)) toAdd.push({ key: "shield_dynamic_snippets", value: isp, type: "snippet" });
    } else if (reason === "bot_ua" || reason === "cidr") {
      // If ISP name looks like a new bad provider not already in our static list, add as snippet
      if (isp && isSafeSnippet(isp)) toAdd.push({ key: "shield_dynamic_snippets", value: isp, type: "snippet" });
    }

    if (toAdd.length === 0) return;

    const pipeline = redis.pipeline();
    for (const item of toAdd) {
      pipeline.sadd(item.key, item.value);
      pipeline.rpush("shield_dynamic_audit", JSON.stringify({
        ts: Date.now(),
        action: "auto-add",
        type: item.type,
        value: item.value,
        trigger_reason: reason,
        trigger_ip: ip,
        trigger_asn: asn,
        trigger_isp: isp,
      }));
    }
    pipeline.ltrim("shield_dynamic_audit", -500, -1);
    await pipeline.exec();
  } catch (e: any) {
    console.error("[shield-log] autoDynamicBlock error:", e.message);
  }
}

function loginHTML(error?: string): string {
  return `<!DOCTYPE html>
<html><head>
<title>Shield Log</title>
<meta name="robots" content="noindex, nofollow, noarchive"/>
</head>
<body style="background:#0d1117;color:#eee;font-family:'Segoe UI',monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
<form method="post" action="/api/shield-log" style="text-align:center;background:#161b22;padding:40px;border-radius:12px;border:1px solid #30363d;">
  <input type="hidden" name="action" value="login"/>
  <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" style="width:40px;height:40px;margin-bottom:12px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  <h2 style="margin-bottom:20px;">Shield Log Viewer</h2>
  ${error ? `<p style="color:#f85149;margin-bottom:12px;">${error}</p>` : ''}
  <input name="pw" type="password" placeholder="Password" autocomplete="off" style="padding:10px 16px;font-size:16px;background:#0d1117;color:#eee;border:1px solid #30363d;border-radius:6px;width:260px;"/><br/><br/>
  <button type="submit" style="padding:10px 30px;background:#7c3aed;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:16px;font-weight:600;">Login</button>
</form></body></html>`;
}

function buildViewerHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="robots" content="noindex, nofollow, noarchive"/>
<title>Shield Log Viewer</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0d1117; color: #e0e0e0; font-family: 'Segoe UI', -apple-system, sans-serif; }

/* Header bar */
.header { background: #161b22; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #30363d; }
.header-left { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 600; }
.header-left svg { width: 22px; height: 22px; }
.header-right { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #8b949e; }
.btn-export { background: #1a7f37; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-export:hover { background: #2ea043; }
.btn-clear { background: #da3633; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-clear:hover { background: #f85149; }
.btn-logout { background: #30363d; color: #c9d1d9; border: 1px solid #484f58; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-logout:hover { background: #484f58; }

.container { max-width: 1600px; margin: 0 auto; padding: 20px 24px; }

/* Stats cards */
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #161b22; border: 1px solid #7c3aed; border-radius: 10px; padding: 20px; text-align: center; }
.stat-card .value { font-size: 36px; font-weight: 700; margin-bottom: 4px; }
.stat-card .label { font-size: 13px; color: #8b949e; text-transform: capitalize; }
.stat-card .value.blue { color: #58a6ff; }
.stat-card .value.green { color: #3fb950; }
.stat-card .value.red { color: #f85149; }
.stat-card .value.yellow { color: #d29922; }

/* Panels */
.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.panel { background: #161b22; border: 1px solid #7c3aed; border-radius: 10px; padding: 20px; }
.panel h3 { color: #c9d1d9; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.panel-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 14px; border-bottom: 1px solid #21262d; }
.panel-row:last-child { border-bottom: none; }
.panel-row .name { color: #c9d1d9; font-family: monospace; }
.panel-row .cnt { background: #1f6feb33; color: #58a6ff; padding: 2px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; }

/* Filters */
.filters { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
.filter-group { display: flex; flex-direction: column; gap: 4px; }
.filter-group label { font-size: 12px; color: #8b949e; }
.filter-group select, .filter-group input { background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; padding: 7px 12px; border-radius: 6px; font-size: 14px; min-width: 140px; }
.btn-filter { background: #da3633; color: #fff; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; }
.btn-filter:hover { background: #f85149; }
.btn-reset { background: #30363d; color: #c9d1d9; border: 1px solid #484f58; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; }
.btn-reset:hover { background: #484f58; }

/* Refresh bar */
.refresh-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.btn-refresh { background: #238636; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-refresh:hover { background: #2ea043; }
.auto-label { font-size: 12px; color: #8b949e; display: flex; align-items: center; gap: 4px; }

/* Pagination */
.pagination { display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.pagination button { background: #30363d; color: #c9d1d9; border: 1px solid #484f58; padding: 5px 12px; border-radius: 5px; cursor: pointer; font-size: 13px; }
.pagination button:hover:not(:disabled) { background: #484f58; }
.pagination button:disabled { opacity: 0.4; cursor: default; }
.pagination button.active { background: #7c3aed; border-color: #7c3aed; color: #fff; }
.pagination .page-info { color: #8b949e; font-size: 13px; }
.page-size-label { color: #8b949e; font-size: 13px; }
.page-size-select { background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; padding: 5px 8px; border-radius: 5px; font-size: 13px; }

/* Table */
.table-wrap { overflow-x: auto; border: 1px solid #30363d; border-radius: 10px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead th { background: #161b22; color: #8b949e; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3px; position: sticky; top: 0; border-bottom: 1px solid #30363d; white-space: nowrap; }
tbody tr { border-bottom: 1px solid #21262d; transition: background 0.1s; }
tbody tr:hover { background: #161b22; }
tbody td { padding: 8px 12px; vertical-align: middle; white-space: nowrap; }

/* Verdict badges */
.v-block { color: #f85149; font-weight: 700; }
.v-block::before { content: "\\2717 "; }
.v-allow { color: #3fb950; font-weight: 700; }
.v-allow::before { content: "\\2713 "; }

/* Check badges */
.check-badges { display: flex; flex-wrap: wrap; gap: 3px; }
.cbadge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; font-family: monospace; white-space: nowrap; }
.cbadge-pass { background: #23863633; color: #3fb950; }
.cbadge-fail { background: #da363333; color: #f85149; }
.cbadge-skip { background: #30363d; color: #8b949e; }

/* UA column */
.ua-cell { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #8b949e; }
.ua-cell:hover { white-space: normal; word-break: break-all; }

/* Dynamic panel */
.dyn-panel { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 20px; margin-bottom: 24px; display: none; }
.dyn-panel.open { display: block; }
.dyn-panel h3 { color: #c9d1d9; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
.dyn-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.dyn-col { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 14px; }
.dyn-col h4 { color: #8b949e; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
.dyn-list { list-style: none; max-height: 200px; overflow-y: auto; margin-bottom: 10px; }
.dyn-list li { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #21262d; font-size: 13px; font-family: monospace; color: #c9d1d9; }
.dyn-list li:last-child { border-bottom: none; }
.btn-dyn-remove { background: none; border: none; color: #f85149; cursor: pointer; font-size: 14px; padding: 0 4px; }
.btn-dyn-remove:hover { color: #ff7b72; }
.dyn-add { display: flex; gap: 6px; }
.dyn-add input { flex: 1; background: #161b22; color: #c9d1d9; border: 1px solid #30363d; padding: 5px 8px; border-radius: 4px; font-size: 12px; }
.btn-dyn-add { background: #1a7f37; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
.btn-dyn-clear { background: #da3633; color: #fff; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; }
.audit-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.audit-table th { background: #161b22; color: #8b949e; padding: 7px 10px; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #30363d; }
.audit-table td { padding: 6px 10px; border-bottom: 1px solid #21262d; color: #c9d1d9; font-family: monospace; }
.badge-auto { background: #b08800; color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 10px; }
.badge-manual-add { background: #1a7f37; color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 10px; }
.badge-manual-remove { background: #da3633; color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 10px; }
.btn-dynamic { background: #6e40c9; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-dynamic:hover { background: #8957e5; }

@media (max-width: 900px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .panels { grid-template-columns: 1fr; }
  .dyn-cols { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<div class="header">
  <div class="header-left">
    <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Shield Log Viewer
  </div>
  <div class="header-right">
    <span id="metaInfo"></span>
    <button class="btn-dynamic" onclick="toggleDynPanel()">Dynamic Lists</button>
    <button class="btn-export" onclick="exportExcel()">Export Excel</button>
    <button class="btn-clear" onclick="clearLogs()">Clear Log</button>
    <form method="post" action="/api/shield-log" style="display:inline;margin:0;">
      <input type="hidden" name="action" value="logout"/>
      <button type="submit" class="btn-logout">Logout</button>
    </form>
  </div>
</div>

<div class="container">
  <div class="stats" id="stats"></div>
  <div class="panels" id="panels"></div>

  <div class="dyn-panel" id="dynPanel">
    <h3>Dynamic Blocklists
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn-refresh" onclick="loadDynamic()" style="font-size:12px;padding:4px 12px;">Refresh</button>
        <button class="btn-dyn-add" id="enrichBtn" onclick="enrichAsns()" style="font-size:12px;padding:4px 12px;">Enrich ASNs from IPs</button>
        <span id="enrichStatus" style="font-size:12px;color:#8b949e;"></span>
      </div>
    </h3>
    <div class="dyn-cols" id="dynCols">Loading...</div>
    <h3 style="margin-top:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
      Auto-add Audit Log
      <span style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:400;">
        Rows per page:
        <select class="page-size-select" id="auditPageSize" onchange="auditPage=1;renderAudit()" style="padding:3px 6px;font-size:12px;">
          <option value="25" selected>25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </span>
    </h3>
    <div class="pagination" id="auditPagTop"></div>
    <div style="overflow-x:auto;border:1px solid #30363d;border-radius:8px;"><table class="audit-table"><thead><tr><th>Time</th><th>Action</th><th>Type</th><th>Value</th><th>Trigger Reason</th><th>Trigger IP</th></tr></thead><tbody id="dynAudit"></tbody></table></div>
    <div class="pagination" id="auditPagBottom"></div>
  </div>

  <div class="filters">
    <div class="filter-group">
      <label>Verdict</label>
      <select id="fVerdict"><option value="">All</option><option value="allowed">Allowed</option><option value="blocked">Blocked</option></select>
    </div>
    <div class="filter-group">
      <label>Country (e.g. US)</label>
      <input id="fCountry" placeholder="" />
    </div>
    <div class="filter-group">
      <label>Block Reason</label>
      <input id="fReason" placeholder="e.g. bot_ua" />
    </div>
    <button class="btn-filter" onclick="applyFilters()">Filter</button>
    <button class="btn-reset" onclick="resetFilters()">Reset</button>
  </div>

  <div class="refresh-bar">
    <button class="btn-refresh" onclick="loadLogs()">Refresh</button>
    <label class="auto-label"><input type="checkbox" id="autoRefresh" checked /> Auto-refresh (10s)</label>
    <span class="page-size-label">Rows per page:</span>
    <select class="page-size-select" id="pageSize" onchange="onPageSizeChange()">
      <option value="25">25</option>
      <option value="50" selected>50</option>
      <option value="100">100</option>
      <option value="250">250</option>
    </select>
  </div>

  <div class="pagination" id="paginationTop"></div>

  <div class="table-wrap">
  <table>
  <thead><tr>
    <th>#</th><th>Time</th><th>IP</th><th>Verdict</th><th>Block Reason</th><th>Country</th><th>ASN</th><th>ISP</th><th>Checks</th><th>UA</th>
  </tr></thead>
  <tbody id="tbody"></tbody>
  </table>
  </div>

  <div class="pagination" id="paginationBottom"></div>
</div>

<script>
let allLogs = [];
let filtered = [];
let autoTimer = null;
let currentPage = 1;
let pageSize = 50;
let auditData = [];
let auditPage = 1;

const CHECK_ORDER = ['bot_ua','headers','proxy_headers','accept_header','ip','cidr','dynamic','ipinfo','provider','country','maxmind','client_js'];

async function clearLogs() {
  if (!confirm('Clear ALL logs? This cannot be undone.')) return;
  try {
    await fetch('/api/shield-log', { method: 'DELETE' });
    loadLogs();
  } catch(e) { alert('Error: ' + e.message); }
}

async function loadLogs() {
  try {
    const r = await fetch('/api/shield-log?format=json');
    if (r.status === 403 || r.status === 401) { window.location.reload(); return; }
    const data = await r.json();
    if (!Array.isArray(data)) {
      document.getElementById('metaInfo').textContent = '\\u26a0 Load error: ' + (data.error || JSON.stringify(data));
      return;
    }
    allLogs = data;
    allLogs.reverse();
    const bytes = new Blob([JSON.stringify(allLogs)]).size;
    const kb = (bytes / 1024).toFixed(1);
    document.getElementById('metaInfo').textContent = kb + ' KB \\u00b7 ' + allLogs.length + ' entries';
    applyFilters();
  } catch(e) {
    document.getElementById('metaInfo').textContent = '\\u26a0 Fetch error: ' + e.message;
    console.error(e);
  }
}

function applyFilters() {
  const v = document.getElementById('fVerdict').value;
  const c = document.getElementById('fCountry').value.toUpperCase().trim();
  const r = document.getElementById('fReason').value.toLowerCase().trim();
  filtered = allLogs.filter(l => {
    if (v && l.verdict !== v) return false;
    if (c && (l.countryCode || '').toUpperCase() !== c) return false;
    if (r && !(l.reason || '').toLowerCase().includes(r)) return false;
    return true;
  });
  currentPage = 1;
  renderStats();
  renderPanels();
  renderTable();
}

function resetFilters() {
  document.getElementById('fVerdict').value = '';
  document.getElementById('fCountry').value = '';
  document.getElementById('fReason').value = '';
  applyFilters();
}

function renderStats() {
  const total = filtered.length;
  const allowed = filtered.filter(l => l.verdict === 'allowed').length;
  const blocked = filtered.filter(l => l.verdict === 'blocked').length;
  const rate = total ? Math.round((blocked / total) * 100) : 0;
  document.getElementById('stats').innerHTML =
    statCard(total, 'Total Visits', 'blue') +
    statCard(allowed, 'Allowed', 'green') +
    statCard(blocked, 'Blocked', 'red') +
    statCard(rate + '%', 'Block Rate', 'yellow');
}

function statCard(value, label, color) {
  return '<div class="stat-card"><div class="value '+color+'">'+value+'</div><div class="label">'+label+'</div></div>';
}

function renderPanels() {
  const reasons = {}, countries = {};
  filtered.forEach(l => {
    if (l.verdict === 'blocked' && l.reason) reasons[l.reason] = (reasons[l.reason]||0) + 1;
    if (l.countryCode) countries[l.countryCode] = (countries[l.countryCode]||0) + 1;
  });
  const sortDesc = obj => Object.entries(obj).sort((a,b) => b[1]-a[1]);

  let html = '<div class="panel"><h3>Top Block Reasons</h3>';
  const rs = sortDesc(reasons);
  if (rs.length === 0) html += '<div style="color:#8b949e;font-size:13px;">No blocks yet</div>';
  rs.forEach(([k,v]) => { html += '<div class="panel-row"><span class="name">'+k+'</span><span class="cnt">'+v+'</span></div>'; });

  html += '</div><div class="panel"><h3>Top Countries</h3>';
  const cs = sortDesc(countries);
  if (cs.length === 0) html += '<div style="color:#8b949e;font-size:13px;">No data</div>';
  cs.forEach(([k,v]) => { html += '<div class="panel-row"><span class="name">'+k+'</span><span class="cnt">'+v+'</span></div>'; });
  html += '</div>';
  document.getElementById('panels').innerHTML = html;
}

function renderCheckBadges(checks) {
  if (!checks) return '';
  let html = '<div class="check-badges">';
  CHECK_ORDER.forEach(key => {
    const val = checks[key];
    if (val === undefined) {
      html += '<span class="cbadge cbadge-skip">\\u2014 skip</span>';
    } else if (val === 'pass' || val === 'present' || val === 'fetched') {
      html += '<span class="cbadge cbadge-pass">\\u2713 '+key+'</span>';
    } else if (val.startsWith('BLOCKED')) {
      html += '<span class="cbadge cbadge-fail">\\u2717 '+key+'</span>';
    } else {
      html += '<span class="cbadge cbadge-skip">\\u2014 '+key+'</span>';
    }
  });
  html += '</div>';
  return html;
}

function fmtTime(ts) {
  if (!ts) return '\\u2014';
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

function esc(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function onPageSizeChange() {
  pageSize = parseInt(document.getElementById('pageSize').value);
  currentPage = 1;
  renderTable();
}

function goToPage(p) {
  currentPage = p;
  renderTable();
  document.getElementById('paginationTop').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderPagination(totalPages, page, total, onPage) {
  if (totalPages <= 1) return '';
  let html = '';
  html += '<button '+(page===1?'disabled':'')+' onclick="('+onPage.toString()+')('+Math.max(1,page-1)+')">&#8592; Prev</button>';
  const delta = 2;
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) pages.push(i);
  }
  let prev = null;
  for (const p of pages) {
    if (prev !== null && p - prev > 1) html += '<span class="page-info">…</span>';
    html += '<button class="'+(p===page?'active':'')+'" onclick="('+onPage.toString()+')('+p+')">'+p+'</button>';
    prev = p;
  }
  html += '<button '+(page===totalPages?'disabled':'')+' onclick="('+onPage.toString()+')('+Math.min(totalPages,page+1)+')">Next &#8594;</button>';
  html += '<span class="page-info">Page '+page+' of '+totalPages+' ('+total+' rows)</span>';
  return html;
}

function renderTable() {
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * pageSize;
  const page = filtered.slice(start, start + pageSize);

  const paginHtml = renderPagination(totalPages, currentPage, filtered.length, goToPage);
  document.getElementById('paginationTop').innerHTML = paginHtml;
  document.getElementById('paginationBottom').innerHTML = paginHtml;

  const tbody = document.getElementById('tbody');
  let html = '';
  page.forEach((l, i) => {
    const vc = l.verdict === 'allowed' ? 'v-allow' : 'v-block';
    const vLabel = l.verdict === 'allowed' ? 'allow' : 'block';
    html += '<tr>'
      + '<td>'+(start+i+1)+'</td>'
      + '<td>'+fmtTime(l.ts)+'</td>'
      + '<td>'+(l.ip||'\\u2014')+'</td>'
      + '<td class="'+vc+'">'+vLabel+'</td>'
      + '<td><span style="font-family:monospace">'+(l.reason||'\\u2014')+'</span></td>'
      + '<td>'+(l.countryCode||'\\u2014')+'</td>'
      + '<td>'+(l.asn||'\\u2014')+'</td>'
      + '<td>'+esc(l.isp||'')+'</td>'
      + '<td>'+renderCheckBadges(l.checks)+'</td>'
      + '<td class="ua-cell" title="'+esc(l.ua)+'">'+esc(l.ua||'\\u2014')+'</td>'
      + '</tr>';
  });
  tbody.innerHTML = html;
}

function exportExcel() {
  if (!filtered.length) { alert('No data to export.'); return; }
  const cols = ['#','Time','IP','Verdict','Block Reason','Country','ASN','ISP','bot_ua','headers','proxy_headers','accept_header','ip_check','cidr','ipinfo','provider','country_check','maxmind','client_js','User Agent'];
  const rows = filtered.map((l, i) => {
    const c = l.checks || {};
    const checkVal = k => {
      const v = c[k];
      if (v === undefined) return 'skip';
      if (v === 'pass' || v === 'present' || v === 'fetched') return 'pass';
      if (typeof v === 'string' && v.startsWith('BLOCKED')) return 'BLOCKED: ' + v.replace(/^BLOCKED[_\\s]*/i,'');
      return v;
    };
    return [
      i+1,
      fmtTime(l.ts),
      l.ip || '',
      l.verdict || '',
      l.reason || '',
      l.countryCode || '',
      l.asn || '',
      l.isp || '',
      checkVal('bot_ua'),
      checkVal('headers'),
      checkVal('proxy_headers'),
      checkVal('accept_header'),
      checkVal('ip'),
      checkVal('cidr'),
      checkVal('ipinfo'),
      checkVal('provider'),
      checkVal('country'),
      checkVal('maxmind'),
      checkVal('client_js'),
      l.ua || ''
    ];
  });

  // Build CSV (Excel-compatible)
  const escape = v => {
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\\n')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const csv = [cols, ...rows].map(r => r.map(escape).join(',')).join('\\r\\n');
  const bom = '\\uFEFF'; // UTF-8 BOM so Excel reads special chars correctly
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = 'shield-log-' + date + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function toggleDynPanel() {
  const p = document.getElementById('dynPanel');
  if (p.classList.toggle('open')) loadDynamic();
}

async function loadDynamic() {
  try {
    const r = await fetch('/api/shield-log?format=dynamic');
    const data = await r.json();
    renderDynamic(data);
  } catch(e) { console.error(e); }
}

function renderDynamic(data) {
  const cols = document.getElementById('dynCols');
  const sections = [
    { key: 'ips', label: 'IPs', type: 'ip', placeholder: '1.2.3.4' },
    { key: 'asns', label: 'ASNs', type: 'asn', placeholder: 'AS12345' },
    { key: 'snippets', label: 'Snippets', type: 'snippet', placeholder: 'nordvpn' },
  ];
  cols.innerHTML = sections.map(s => {
    const items = (data[s.key] || []).sort();
    const list = items.map(v =>
      '<li><span>'+esc(v)+'</span><button class="btn-dyn-remove" data-type="'+s.type+'" data-value="'+esc(v)+'" title="Remove">&times;</button></li>'
    ).join('') || '<li style="color:#8b949e;font-family:sans-serif">Empty</li>';
    return '<div class="dyn-col">'
      + '<h4>'+s.label+' <span style="color:#58a6ff">('+items.length+')</span> <button class="btn-dyn-clear" data-type="'+s.type+'">Clear</button></h4>'
      + '<ul class="dyn-list">'+list+'</ul>'
      + '<div class="dyn-add"><input id="dynInput_'+s.type+'" placeholder="'+s.placeholder+'"/><button class="btn-dyn-add" data-type="'+s.type+'">Add</button></div>'
      + '</div>';
  }).join('');

  // Attach events via delegation to avoid quote issues
  cols.onclick = function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.classList.contains('btn-dyn-remove')) {
      dynRemove(btn.dataset.type, btn.dataset.value);
    } else if (btn.classList.contains('btn-dyn-add')) {
      dynAdd(btn.dataset.type);
    } else if (btn.classList.contains('btn-dyn-clear')) {
      dynClear(btn.dataset.type);
    }
  };

  auditData = data.audit || [];
  auditPage = 1;
  renderAudit();
}

function renderAudit() {
  const ps = parseInt(document.getElementById('auditPageSize').value) || 25;
  const totalPages = Math.max(1, Math.ceil(auditData.length / ps));
  if (auditPage > totalPages) auditPage = totalPages;
  const start = (auditPage - 1) * ps;
  const page = auditData.slice(start, start + ps);

  const paginHtml = auditData.length > ps ? renderPagination(totalPages, auditPage, auditData.length, function(p){ auditPage=p; renderAudit(); }) : '';
  document.getElementById('auditPagTop').innerHTML = paginHtml;
  document.getElementById('auditPagBottom').innerHTML = paginHtml;

  const auditHtml = page.map(a => {
    const badge = a.action === 'auto-add' ? '<span class="badge-auto">auto</span>'
      : a.action === 'manual-add' ? '<span class="badge-manual-add">+manual</span>'
      : '<span class="badge-manual-remove">&minus;manual</span>';
    return '<tr><td>'+fmtTime(a.ts)+'</td><td>'+badge+'</td><td>'+esc(a.type||'')+'</td><td>'+esc(a.value||'')+'</td><td>'+esc(a.trigger_reason||'')+'</td><td>'+esc(a.trigger_ip||'')+'</td></tr>';
  }).join('') || '<tr><td colspan="6" style="color:#8b949e;text-align:center;padding:16px;">No audit entries yet</td></tr>';
  document.getElementById('dynAudit').innerHTML = auditHtml;
}

async function dynRemove(type, value) {
  if (!confirm('Remove '+type+': '+value+'?')) return;
  const fd = new FormData(); fd.append('action','dynamic-remove'); fd.append('type',type); fd.append('value',value);
  await fetch('/api/shield-log', { method:'POST', body:fd });
  loadDynamic();
}

async function dynAdd(type) {
  const input = document.getElementById('dynInput_'+type);
  const value = input.value.trim();
  if (!value) return;
  const fd = new FormData(); fd.append('action','dynamic-add'); fd.append('type',type); fd.append('value',value);
  await fetch('/api/shield-log', { method:'POST', body:fd });
  input.value = '';
  loadDynamic();
}

async function enrichAsns() {
  const btn = document.getElementById('enrichBtn');
  const status = document.getElementById('enrichStatus');
  btn.disabled = true;
  status.textContent = 'Looking up ASNs...';
  try {
    const fd = new FormData();
    fd.append('action', 'dynamic-enrich-asns');
    const r = await fetch('/api/shield-log', { method: 'POST', body: fd });
    const data = await r.json();
    if (data.ok) {
      status.textContent = data.added + ' new ASNs added.';
      loadDynamic();
    } else {
      status.textContent = 'Error: ' + (data.error || 'unknown');
    }
  } catch(e) {
    status.textContent = 'Error: ' + e.message;
  }
  btn.disabled = false;
}

async function dynClear(type) {
  if (!confirm('Clear ALL dynamic '+type+'s? This cannot be undone.')) return;
  const fd = new FormData(); fd.append('action','dynamic-clear'); fd.append('type',type);
  await fetch('/api/shield-log', { method:'POST', body:fd });
  loadDynamic();
}

function startAutoRefresh() { stopAutoRefresh(); autoTimer = setInterval(loadLogs, 10000); }
function stopAutoRefresh() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
document.getElementById('autoRefresh').addEventListener('change', function() {
  if (this.checked) startAutoRefresh(); else stopAutoRefresh();
});

loadLogs();
startAutoRefresh();
</script>
</body>
</html>`;
}
