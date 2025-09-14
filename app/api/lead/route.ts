import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const { email, offerId, store } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }

    // Basic sanity
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const now = new Date();
    const iso = now.toISOString();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");

    const body = JSON.stringify({
      email: normalized,
      offerId: offerId ?? null,
      store: store ?? null,
      ts: iso,
      ua: req.headers.get("user-agent") ?? null,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    // Unique filename per lead so it shows up clearly in the Blob browser
    const key = `coupon-leads/${y}/${m}/${d}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.json`;

    const token = process.env.BLOB_READ_WRITE_TOKEN; // must be set in project env
    const { url } = await put(key, body, {
      access: "private",
      contentType: "application/json",
      token, // use the project env var
    });

    // Optional: log to Vercel function logs for debugging
    console.log("Saved lead:", { key, url });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Lead save failed:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
