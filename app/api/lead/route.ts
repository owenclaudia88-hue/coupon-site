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

/* --- Patch: add alt="" to Brevo tracking pixel to avoid SpamAssassin penalty --- */
function addAltToTrackingPixel(html: string) {
  // Insert alt="" into any <img> whose src contains sendibt3 (Brevo tracking)
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
/* Softer subject: no emojis, no “belöning”, “grattis”, “missa inte” */
const SPINTAX_SUBJECT_MAIN =
  `{Tack för din registrering|Välkommen|Bekräftelse|Information om ditt konto} – iPhone 17 Pro Max {rabattinformation|kampanjinfo|uppdatering}`

const SPINTAX_BODY_MAIN_BASE = `{Hej,|Hej där,|Hej och tack för att du hörde av dig,}

Du har registrerat dig via en av våra partnerwebbplatser. Vi samarbetar med utvalda aktörer för att dela relevanta erbjudanden och uppdateringar med våra kunder.

I samband med öppningen av vår butik i Stockholm vill vi informera om aktuella priser och kampanjer för iPhone 17 Pro Max. Om du vill läsa mer, hittar du detaljerna här:

[[OFFER_LINK]]

Du får det här meddelandet eftersom du nyligen anmälde dig via en partnerwebbplats. Om du inte vill ta emot fler uppdateringar kan du avsluta prenumerationen längst ned i mejlet.

{Vänliga hälsningar,|Med vänliga hälsningar,|Allt gott,}`

const SIGNOFFS = [
  'Elgigantens Onlineavdelning','Elgigantens Kundsupport','Elgiganten Sverige'
]

const SPINTAX_SUBJECT_REM =
  `{Påminnelse|Uppföljning|Kort uppdatering}: information om iPhone 17 Pro Max-erbjudande`

const SPINTAX_BODY_REM = `{Hej igen,|Hej,}

Vi vill bara skicka en kort uppdatering. Om du fortfarande vill läsa mer om kampanjen för iPhone 17 Pro Max finns informationen här:

[[OFFER_LINK]]

Tack för att du är med i vårt nyhetsflöde. Du kan när som helst avsluta prenumerationen via länken längst ned.

{Vänliga hälsningar,|Med vänliga hälsningar,|Allt gott,}`

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
    const listUnsubMail = process.env.UNSUB_MAILTO || 'unsubscribe@elgigantensupport.online'

    if (!apiKey) {
      console.warn('BREVO_API_KEY missing — lead stored but email not scheduled.')
      return NextResponse.json({ ok: true, leadKey: key, emailScheduled: false })
    }

    // Force in-domain endpoints
    const unsubOrigin = process.env.UNSUB_ORIGIN || 'https://elgigantensupport.online'
    const redirectOrigin = process.env.REDIRECT_ORIGIN || 'https://elgigantensupport.online'
    const redirectSecret = process.env.REDIRECT_SECRET || '6f3d7c29f8b45a7e1bde93f02a61c48c5a78d3ef4b9c217f93c0d7aebf42c1a1'

    // Choose one offer id & build signed redirect URL
    const offerIdPicked = pickOfferId()
    const tsNow = Date.now()
    const clickUrl = await signedRedirectUrl(offerIdPicked, tsNow, redirectOrigin, redirectSecret)
    const offerLinkHtml = renderOneOfferLinkHtml(clickUrl)

    // Company footer
    const companyFooterLines = [
      'Elgigantens Onlineavdelning',
      'Kungsgatan 12–14',
      '111 35 Stockholm',
      'Sweden'
    ]

    // Schedule: welcome in 1 minute by default, reminder in 24h
    const url = new URL(req.url)
    const delayMin = Math.max(0, Number(url.searchParams.get('delayMin') ?? '1'))
    const reminderHours = Math.max(1, Number(url.searchParams.get('reminderHours') ?? '24'))

    const scheduledAtWelcome = new Date(Date.now() + delayMin * 60 * 1000).toISOString()
    const scheduledAtReminder = new Date(Date.now() + reminderHours * 60 * 60 * 1000).toISOString()

    // Expand spintax
    const subjectWelcome = expandSpintax(SPINTAX_SUBJECT_MAIN)
    const signoff = SIGNOFFS[Math.floor(Math.random() * SIGNOFFS.length)]
    const bodyWelcomeCore = expandSpintax(SPINTAX_BODY_MAIN_BASE) + `

**${signoff}**`

    const subjectReminder = expandSpintax(SPINTAX_SUBJECT_REM)
    const bodyReminderCore = expandSpintax(SPINTAX_BODY_REM) + `

**${signoff}**`

    // Helper to send via Brevo (HTML + Text + scheduledAt)
    async function sendBrevo(
      subject: string,
      htmlContent: string,
      textContent: string,
      scheduledAtISO: string,
      headers: Record<string, string>
    ) {
      return fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey! },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: normalizedEmail, name: [firstName, lastName].filter(Boolean).join(' ') || normalizedEmail }],
          subject,
          htmlContent,
          textContent,
          headers,
          scheduledAt: scheduledAtISO,
        }),
      })
    }

    // Temporary unsubscribe before we know reminder messageId
    const preToken = `${normalizedEmail}|pending|${tsNow}`
    const sigPre = process.env.UNSUB_SECRET ? await hmac(preToken, process.env.UNSUB_SECRET) : 'nosig'
    const unsubUrlPre = `${unsubOrigin}/api/unsubscribe?e=${encodeURIComponent(normalizedEmail)}&m=pending&t=${tsNow}&sig=${sigPre}`

    const baseHeaders = {
      'X-Entity-Ref-ID': `lead-${id}`,
      'List-Unsubscribe': listUnsubHeader(unsubUrlPre, listUnsubMail || undefined),
      // One-click unsubscribe header
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    }

    // Schedule REMINDER first to get messageId for unsubscribe token
    let htmlReminderPre = buildHtmlOneLink(bodyReminderCore, offerLinkHtml, unsubUrlPre, companyFooterLines)
    htmlReminderPre = addAltToTrackingPixel(htmlReminderPre)
    const textReminderPre = buildPlainTextOneLink(bodyReminderCore, clickUrl, unsubUrlPre, companyFooterLines)

    const resReminder = await sendBrevo(subjectReminder, htmlReminderPre, textReminderPre, scheduledAtReminder, baseHeaders)
    const reminderOk = resReminder.ok
    const reminderData = reminderOk ? await resReminder.json().catch(() => ({})) : null
    const reminderMsgId = reminderData?.messageId || 'pending'

    // Final unsubscribe link with reminder messageId
    const tokenPayload = `${normalizedEmail}|${reminderMsgId}|${tsNow}`
    const sig = process.env.UNSUB_SECRET ? await hmac(tokenPayload, process.env.UNSUB_SECRET) : 'nosig'
    const unsubUrl = `${unsubOrigin}/api/unsubscribe?e=${encodeURIComponent(normalizedEmail)}&m=${encodeURIComponent(reminderMsgId)}&t=${tsNow}&sig=${sig}`
    const headersWithUnsub = {
      ...baseHeaders,
      'List-Unsubscribe': listUnsubHeader(unsubUrl, listUnsubMail || undefined),
      // keep one-click here too
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    }

    // Build and schedule WELCOME (single-link)
    let htmlWelcome = buildHtmlOneLink(bodyWelcomeCore, offerLinkHtml, unsubUrl, companyFooterLines)
    htmlWelcome = addAltToTrackingPixel(htmlWelcome)
    const textWelcome = buildPlainTextOneLink(bodyWelcomeCore, clickUrl, unsubUrl, companyFooterLines)

    const resWelcome = await sendBrevo(subjectWelcome, htmlWelcome, textWelcome, scheduledAtWelcome, headersWithUnsub)
    const welcomeOk = resWelcome.ok
    if (!welcomeOk) {
      const txt = await resWelcome.text().catch(() => '')
      console.error('Brevo welcome schedule error:', resWelcome.status, txt)
    }
    if (!reminderOk) {
      const txt = await resReminder.text().catch(() => '')
      console.error('Brevo reminder schedule error:', resReminder.status, txt)
    }

    return NextResponse.json({
      ok: true,
      leadKey: key,
      emailScheduled: welcomeOk,
      reminderScheduled: reminderOk,
      scheduledAtWelcome,
      scheduledAtReminder,
      reminderMessageId: reminderMsgId,
      unsubscribeUrl: unsubUrl,
      clickUrlUsed: clickUrl,
      offerIdPicked,
    })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 })
  }
}
