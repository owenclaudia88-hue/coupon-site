// app/api/isp-lookup/route.ts
import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime here (needed to read .mmdb)
export const runtime = "nodejs";

type IspRecord = {
  traits?: {
    isp?: string;
    organization?: string;
    autonomous_system_number?: number;
    autonomous_system_organization?: string;
  };
};

// Keep the same provider lists as middleware to stay consistent
const BAD_ASN = new Set<number>([
  15169, 396982,    // Google
  13335,            // Cloudflare
  16509, 14618,     // Amazon / AWS
  8075, 8068,       // Microsoft / Azure / Bing
  32934,            // Meta / Facebook
  54113,            // Fastly
  20940,            // Akamai
]);

const BAD_NAME_SNIPPETS = [
  "google", "google llc", "google cloud",
  "cloudflare", "cloudflare, inc",
  "amazon", "aws", "amazon.com", "amazon technologies",
  "microsoft", "azure", "bing",
  "meta", "facebook",
  "fastly",
  "akamai",
];

// Lazily-loaded, cached reader
let cachedReader: any | null = null;
let triedLoad = false;

async function getReader() {
  if (cachedReader || triedLoad) return cachedReader;

  triedLoad = true;
  try {
    // dynamic import works on Node runtime
    const maxmind = await import("maxmind");

    // Prefer the dated DB if exists; otherwise use the generic file
    const pathA = process.cwd() + "/geoip/GeoIP2-ISP_20230210.mmdb";
    const pathB = process.cwd() + "/geoip/GeoIP2-ISP.mmdb";

    // Try first pathA, then pathB
    try {
      cachedReader = await maxmind.open(pathA);
    } catch {
      cachedReader = await maxmind.open(pathB);
    }
  } catch (e) {
    cachedReader = null;
  }
  return cachedReader;
}

function matchesBadProvider(rec: IspRecord | null) {
  if (!rec || !rec.traits) return false;
  const t = rec.traits;

  if (typeof t.autonomous_system_number === "number" && BAD_ASN.has(t.autonomous_system_number)) {
    return true;
  }

  const fields = [
    t.isp || "",
    t.organization || "",
    t.autonomous_system_organization || "",
  ].join(" ").toLowerCase();

  return BAD_NAME_SNIPPETS.some((snip) => fields.includes(snip));
}

export async function GET(req: NextRequest) {
  // (Tiny guard to avoid open exposure if you want)
  if (req.headers.get("x-mw") !== "1") {
    return NextResponse.json({ isBad: false }, { status: 200 });
  }

  const ip = req.nextUrl.searchParams.get("ip") || "";
  if (!ip) return NextResponse.json({ isBad: false }, { status: 200 });

  try {
    const reader = await getReader();
    if (!reader) return NextResponse.json({ isBad: false }, { status: 200 });

    const rec = (await reader.get(ip)) as IspRecord | null;
    const isBad = matchesBadProvider(rec);
    return NextResponse.json({ isBad }, { status: 200 });
  } catch {
    return NextResponse.json({ isBad: false }, { status: 200 });
  }
}
