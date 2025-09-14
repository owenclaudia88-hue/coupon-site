import { NextResponse } from "next/server";

// OPTION A: Vercel KV (recommended for simple lists)
//  - Enable Vercel KV and add env vars: KV_REST_API_URL, KV_REST_API_TOKEN
//  - Install: npm i @vercel/kv
// import { kv } from "@vercel/kv";

// OPTION B: Vercel Blob (no DB, JSONL append)
//  - Enable Vercel Blob & add: BLOB_READ_WRITE_TOKEN
//  - Install: npm i @vercel/blob
// import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const entry = {
      email: String(data?.email || "").toLowerCase().trim(),
      store: data?.store || "",
      offerId: data?.offerId || "",
      ts: data?.ts || Date.now(),
      ua: req.headers.get("user-agent") || "",
      ip: req.headers.get("x-forwarded-for") || "",
    };

    if (!entry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // --- Pick ONE of the storage options below ---

    // // A) Save to Vercel KV list
    // await kv.lpush("leads", JSON.stringify(entry));

    // // B) Append to a JSONL file in Vercel Blob
    // await put("leads.jsonl", JSON.stringify(entry) + "\n", {
    //   access: "private",
    //   contentType: "application/jsonl",
    //   addRandomSuffix: false,
    //   multipart: true,
    //   token: process.env.BLOB_READ_WRITE_TOKEN,
    //   // @ts-ignore - undocumented but supported: append JSON lines
    //   append: true,
    // });

    // For now (if you haven't wired storage yet), just log it.
    console.log("LEAD:", entry);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Lead save error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
