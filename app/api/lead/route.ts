import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const entry = {
      email: String(data?.email || "").toLowerCase().trim(),
      store: data?.store || "",
      offerId: data?.offerId || "",
      ts: Date.now(),
      ua: req.headers.get("user-agent") || "",
      ip: req.headers.get("x-forwarded-for") || "",
    };

    if (!entry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // Append this entry to a file in your Blob storage
    await put("leads.jsonl", JSON.stringify(entry) + "\n", {
      access: "private",
      contentType: "application/jsonl",
      addRandomSuffix: false, // always same file name
      multipart: true,
      token: process.env.BLOB_READ_WRITE_TOKEN, // comes from Vercel env
      // @ts-ignore: undocumented but supported
      append: true, // append instead of overwrite
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Lead save error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
