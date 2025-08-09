// app/api/get-offer-url/route.ts
import { NextRequest, NextResponse } from "next/server"

// Relative to this file (../../ goes back to app/)
import { offerRedirects as elgigantenRedirects } from "../../elgiganten/offerRedirects"
import { offerRedirects as komplettRedirects }   from "../../komplett/offerRedirects"
import { offerRedirects as powerRedirects }      from "../../power/offerRedirects"
import { offerRedirects as netonnetRedirects }   from "../../netonnet/offerRedirects"
import { offerRedirects as webhallenRedirects }  from "../../webhallen/offerRedirects"
import { offerRedirects as cdonRedirects }       from "../../cdon/offerRedirects"

type StoreKey = "elgiganten" | "komplett" | "power" | "netonnet" | "webhallen" | "cdon"

const maps: Record<StoreKey, Record<string, string>> = {
  elgiganten: elgigantenRedirects,
  komplett  : komplettRedirects,
  power     : powerRedirects,
  netonnet  : netonnetRedirects,
  webhallen : webhallenRedirects,
  cdon      : cdonRedirects,
}

function inferStore(req: NextRequest, explicit?: string): StoreKey {
  // 1) explicit wins
  if (explicit && explicit in maps) return explicit as StoreKey

  // 2) infer from Referer (works with your existing client calls)
  const ref = (req.headers.get("referer") || "").toLowerCase()
  if (ref.includes("/komplett"))  return "komplett"
  if (ref.includes("/power"))     return "power"
  if (ref.includes("/netonnet"))  return "netonnet"
  if (ref.includes("/webhallen")) return "webhallen"
  if (ref.includes("/cdon"))      return "cdon"

  // 3) default
  return "elgiganten"
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return new NextResponse("Invalid content type", { status: 400 })
    }

    const body = await req.json()
    const id = (body?.id ?? "").toString().trim()
    const store = (body?.store ?? "").toString().trim().toLowerCase() as StoreKey | ""

    if (!id) return new NextResponse("Missing 'id'", { status: 400 })

    const chosenStore = inferStore(req, store)
    const table = maps[chosenStore]
    const url = table?.[id]

    if (!url) return new NextResponse("Offer not found", { status: 404 })

    return NextResponse.json({ url })
  } catch (err) {
    console.error("get-offer-url error:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
