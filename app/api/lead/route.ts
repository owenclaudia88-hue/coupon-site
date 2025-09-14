import { put } from "@vercel/blob";

export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim();
    const offerId = String(body?.offerId || "unknown");
    const store = String(body?.store || "unknown");
    const ts = Number(body?.ts) || Date.now();

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_email" }), {
        status: 400, headers: { "content-type": "application/json" }
      });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // You’ll see this in Vercel function logs if the env var is missing
      return new Response(JSON.stringify({ ok: false, error: "missing_blob_token" }), {
        status: 500, headers: { "content-type": "application/json" }
      });
    }

    const id = `${store}-${offerId}-${ts}-${Math.random().toString(36).slice(2)}`;
    await put(`coupon-leads/${id}.json`,
      JSON.stringify({ email, offerId, store, ts,
        ua: req.headers.get("user-agent") || "",
        ip: req.headers.get("x-forwarded-for") || null
      }, null, 2),
      { access: "private", contentType: "application/json" }
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 201, headers: { "content-type": "application/json" }
    });
  } catch (err: any) {
    console.error("lead error:", err);
    return new Response(JSON.stringify({ ok: false, error: err?.message || "server_error" }), {
      status: 500, headers: { "content-type": "application/json" }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
