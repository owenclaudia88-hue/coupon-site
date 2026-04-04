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

@media (max-width: 900px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .panels { grid-template-columns: 1fr; }
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
  </div>

  <div class="table-wrap">
  <table>
  <thead><tr>
    <th>#</th><th>Time</th><th>IP</th><th>Verdict</th><th>Block Reason</th><th>Country</th><th>ASN</th><th>ISP</th><th>Checks</th><th>UA</th>
  </tr></thead>
  <tbody id="tbody"></tbody>
  </table>
  </div>
</div>

<script>
let allLogs = [];
let filtered = [];
let autoTimer = null;

const CHECK_ORDER = ['bot_ua','headers','proxy_headers','accept_header','ip','cidr','ipinfo','provider','country','maxmind','client_js'];

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
    allLogs = await r.json();
    allLogs.reverse();
    const bytes = new Blob([JSON.stringify(allLogs)]).size;
    const kb = (bytes / 1024).toFixed(1);
    document.getElementById('metaInfo').textContent = kb + ' KB \\u00b7 ' + allLogs.length + ' entries shown';
    applyFilters();
  } catch(e) { console.error(e); }
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

function renderTable() {
  const tbody = document.getElementById('tbody');
  let html = '';
  filtered.forEach((l, i) => {
    const vc = l.verdict === 'allowed' ? 'v-allow' : 'v-block';
    const vLabel = l.verdict === 'allowed' ? 'allow' : 'block';
    html += '<tr>'
      + '<td>'+(i+1)+'</td>'
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
