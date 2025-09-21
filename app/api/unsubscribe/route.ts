// app/api/unsubscribe/route.ts
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge'

async function hmacVerify(payload: string, signature: string, secret: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  const calc = Buffer.from(mac).toString('base64url')
  return crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(signature))
}
async function sha256Hex(s: string) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(s))
  return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('')
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = (url.searchParams.get('e') || '').toLowerCase()
  const msgId = url.searchParams.get('m') || ''
  const ts = url.searchParams.get('t') || ''
  const sig = url.searchParams.get('sig') || ''

  if (!email || !sig || !process.env.UNSUB_SECRET) {
    return new NextResponse('Ogiltig begäran.', { status: 400 })
  }

  const payload = `${email}|${msgId}|${ts}`
  const ok = await hmacVerify(payload, sig, process.env.UNSUB_SECRET)
  if (!ok) return new NextResponse('Ogiltig eller föråldrad länk.', { status: 400 })

  // 1) Mark unsubscribed (Blob)
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new NextResponse('Servern saknar behörighet att spara.', { status: 500 })
  }
  const emailHash = await sha256Hex(email)
  const body = JSON.stringify({ email, emailHash, unsubscribedAt: new Date().toISOString(), msgId })
  await put(`unsub/${emailHash}.json`, body, {
    access: 'private',
    contentType: 'application/json',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
  })

  // 2) Cancel scheduled reminder (if any)
  let cancelled = false
  try {
    if (process.env.BREVO_API_KEY && msgId && msgId !== 'pending') {
      const del = await fetch(`https://api.brevo.com/v3/smtp/email/${encodeURIComponent(msgId)}`, {
        method: 'DELETE',
        headers: { 'api-key': process.env.BREVO_API_KEY },
      })
      cancelled = del.ok
    }
  } catch (e) {
    // ignore, we still show success page
  }

  // 3) Show a simple confirmation page
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Avslutad prenumeration</title></head>
  <body style="font-family:Arial,Helvetica,sans-serif; padding:32px;">
    <h1>Du har avslutat prenumerationen</h1>
    <p>Du kommer inte längre att få erbjudanden via e-post från oss på denna adress.</p>
    <p style="color:#6b7280;font-size:12px;">${cancelled ? 'Eventuell schemalagd påminnelse har avbrutits.' : 'Om en påminnelse redan var på väg kan den fortfarande levereras.'}</p>
  </body></html>`
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
