import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
// @ts-ignore – types aren’t shipped
import maxmind from "maxmind";

/**
 * We keep a cached Reader between invocations (Node runtime),
 * so we don’t reopen the .mmdb on every call.
 */
let readerPromise: Promise<any> | null = null;

async function getReader() {
  if (!readerPromise) {
    // Try the main one first, fall back to dated copy if needed
    const candidates = [
      path.join(process.cwd(), "geoip", "GeoIP2-ISP.mmdb"),
      path.join(process.cwd(), "geoip", "GeoIP2-ISP_20230210.mmdb"),
    ];
    let found: string | null = null;
    for (const p of candidates) {
      try {
        await fs.access(p);
        found = p;
        break;
      } catch {}
    }
    if (!found) {
      throw new Error("No GeoIP2-ISP mmdb file found in /geoip");
    }
    readerPromise = maxmind.open(found);
  }
  return readerPromise;
}

/** Normalize helper */
const norm = (s?: string | number | null) =>
  (s ?? "").toString().trim().toLowerCase();

/** Read env lists (same ones you already use in middleware) */
function getEnvSets() {
  const badAsns = new Set(
    (process.env.BLOCKED_ASNS || "")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
  );
  const badSnips = (process.env.BLOCKED_ISP_SUBSTRS || "")
    .split(",")
    .map((s) => norm(s))
    .filter(Boolean);
  return { badAsns, badSnips };
}

/**
 * GET /api/isp-lookup?ip=1.2.3.4
 * Returns: { isBad, reason, details }
 */
export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const ip = (searchParams.get("ip") || "").trim();

    if (!ip) {
      return NextResponse.json(
        { isBad: false, reason: "no-ip" },
        { status: 400 }
      );
    }

    const reader = await getReader();
    const rec = reader.get(ip) || {};

    // Fields from GeoIP2 ISP (may or may not be present depending on IP)
    const autonomous_system_number = rec.autonomous_system_number as
      | number
      | undefined;
    const autonomous_system_organization = rec.autonomous_system_organization as
      | string
      | undefined;
    const isp = rec.isp as string | undefined;
    const organization = rec.organization as string | undefined;

    const asnStr = autonomous_system_number
      ? `AS${autonomous_system_number}`
      : "";
    const asOrg = norm(autonomous_system_organization);
    const ispNorm = norm(isp);
    const orgNorm = norm(organization);

    const { badAsns, badSnips } = getEnvSets();

    // 1) ASN match (if present)
    if (asnStr && badAsns.has(asnStr.toUpperCase())) {
      return NextResponse.json({
        isBad: true,
        reason: "maxmind-asn",
        details: {
          ip,
          asn: asnStr,
          as_org: autonomous_system_organization || "",
          isp: isp || "",
          organization: organization || "",
        },
      });
    }

    // 2) Name/snippet match across isp / organization / AS org
    const combined = `${ispNorm} ${orgNorm} ${asOrg}`.trim();
    if (combined && badSnips.some((snip) => combined.includes(snip))) {
      return NextResponse.json({
        isBad: true,
        reason: "maxmind-name",
        details: {
          ip,
          asn: asnStr,
          as_org: autonomous_system_organization || "",
          isp: isp || "",
          organization: organization || "",
        },
      });
    }

    // No match
    return NextResponse.json({
      isBad: false,
      reason: "maxmind-no-match",
      details: {
        ip,
        asn: asnStr,
        as_org: autonomous_system_organization || "",
        isp: isp || "",
        organization: organization || "",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { isBad: false, reason: "maxmind-error", error: e?.message || String(e) },
      { status: 200 }
    );
  }
}
