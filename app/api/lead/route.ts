// app/api/lead/route.ts
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge' // keep this so it runs fast and near users

type LeadBody = {
  email?: string
  offerId?: string
  store?: string
  ts?: number
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export async function POST(req: Request) {
  try {
    const { email, offerId, store, ts }: LeadBody = await req.json()

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'bad_email' }, { status: 400 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'no_blob_token' }, { status: 500 })
    }

    // basic metadata
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || null
    const ua = req.headers.get('user-agent') || null

    const payload = JSON.stringify({
      email: email.trim().toLowerCase(),
      offerId: offerId || null,
      store: store || null,
      ts: ts || Date.now(),
      ip,
      ua,
    })

    // nice key structure in your Blob store
    const day = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const key = `leads/${day}/${crypto.randomUUID()}.json`

    await put(key, payload, {
      access: 'public',                       // <-- THIS fixes the error
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN, // use the RW token from Vercel env
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json(
      { ok: false, error: err?.message || 'unknown' },
      { status: 500 },
    )
  }
}
