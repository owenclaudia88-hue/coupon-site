// app/api/lead/route.ts
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge' // keep Edge: we use fetch to Brevo (SDK isn't edge-compatible)

type LeadBody = {
  email?: string
  offerId?: string
  store?: string
  ts?: number
  firstName?: string
  lastName?: string
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export async function POST(req: Request) {
  try {
    const { email, offerId, store, ts, firstName, lastName }: LeadBody = await req.json()

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'bad_email' }, { status: 400 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'no_blob_token' }, { status: 500 })
    }

    // ---- Save lead to Blob (kept exactly as your current logic) ----
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || null
    const ua = req.headers.get('user-agent') || null

    const normalizedEmail = email.trim().toLowerCase()
    const payload = JSON.stringify({
      email: normalizedEmail,
      offerId: offerId || null,
      store: store || null,
      ts: ts || Date.now(),
      ip,
      ua,
    })

    const day = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const key = `leads/${day}/${crypto.randomUUID()}.json`

    await put(key, payload, {
      access: 'public', // you set this intentionally; keep as-is
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // ---- Schedule email via Brevo (15 minutes later) ----
    const apiKey = process.env.BREVO_API_KEY
    const fromEmail = process.env.BREVO_SENDER_EMAIL || 'olivia@elgigantensupport.online'
    const fromName  = process.env.BREVO_SENDER_NAME  || 'Olivia'

    if (!apiKey) {
      // Don't fail the whole request if email config is missing; just return ok with a warning
      console.warn('BREVO_API_KEY missing — lead stored but email not scheduled.')
      return NextResponse.json({ ok: true, leadKey: key, emailScheduled: false })
    }

    const subject   = 'Welcome 👋'
    const preheader = "Thanks for signing up—here’s what’s next"
    const htmlContent = `
<!doctype html><html><head>
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
  <div style="max-width:560px;margin:0 auto;">
    <p style="color:#6b7280;font-size:12px;margin:0 0 12px 0;">${preheader}</p>
    <h1 style="margin:0 0 16px 0;">Hi ${firstName ?? 'there'} 👋</h1>
    <p>Thanks for joining us! This is a <strong>dummy welcome email</strong> — replace this content later.</p>
    <p>👉 Add your onboarding steps, coupon, and links here.</p>
    <p style="margin-top:24px;">— Olivia</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="font-size:12px;color:#6b7280;">If you didn’t sign up, you can ignore this email.</p>
  </div>
</body></html>`.trim()

    const sendAtISO = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    // Brevo Transactional Email API (Edge-friendly fetch)
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: normalizedEmail, name: [firstName, lastName].filter(Boolean).join(' ') || normalizedEmail }],
        subject,
        htmlContent,
        headers: { 'X-Entity-Ref-ID': `welcome-${key}` },
        sendAt: sendAtISO, // schedule for the future
      }),
    })

    if (!brevoRes.ok) {
      const txt = await brevoRes.text().catch(() => '')
      console.error('Brevo schedule error:', brevoRes.status, txt)
      // Still return ok:true because the lead was saved; you can monitor logs for email failures
      return NextResponse.json({ ok: true, leadKey: key, emailScheduled: false, brevoStatus: brevoRes.status })
    }

    const brevoData = await brevoRes.json().catch(() => ({}))
    return NextResponse.json({
      ok: true,
      leadKey: key,
      emailScheduled: true,
      sendAt: sendAtISO,
      brevo: brevoData,
    })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 })
  }
}
