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
    <a href="${href}" style="color:#2563eb;text-decoration:underline;">Öppna erbjudandet</a>
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
  return textBody.replaceAll('[[OFFER_LINK]]', offerLink)
    + `\n\n---\n${companyFooterLines.join('\n')}\nAvsluta prenumeration: ${unsubHref}\n`
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
/** Final destinations (your sverige9 links), keyed by id a–j */
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
const SPINTAX_SUBJECT_MAIN = `{Exklusivt|Speciellt|Begränsat tillfälle|Grattis!|Du har blivit utvald till ett|Missa inte detta} iPhone 17 Pro Max {erbjudande|deal|rabatt|belöning} — {för att fira vår flaggskeppsbutik|för att fira vår nya butik i Stockholm|som en del av vår stora öppning i Stockholm|tillgängligt endast via vårt partnernätverk} 🎉`

const SPINTAX_BODY_MAIN_BASE = `{Bästa Elgiganten-kund,|Elgiganten-kund,|Bästa värderade kund,|Bästa kund,|Bästa Elgiganten-klient,|Bästa värdefulla kund,|Bästa smartphone-entusiast,|Värderade kund,|Värderade klient,|Hej,|Hej där,}

{Tack för att du registrerade dig via en av våra betrodda partnersajter.|Vi är glada att du har gått med oss genom en av våra partnerplattformar.|Tack för att du anmälde dig via en av våra partnersidor.|Vi uppskattar att du gick med oss via vårt partnernätverk.}  
{Vi samarbetar med utvalda partners för att kunna erbjuda de mest exklusiva erbjudandena,|Genom att samarbeta med ledande sajter kan vi dela oslagbara deals,|Med våra betrodda partners kan vi leverera unika rabatter,} och idag {har vi något speciellt reserverat för dig.|är vi glada att dela ett unikt tillfälle.|har du låst upp en exklusiv belöning.}

{För att fira öppningen av vår flaggskeppsbutik i Stockholm ger vi tidig tillgång till en exklusiv iPhone 17 Pro Max-rabatt.|Som en del av vår nya butikslansering i Stockholm kan du nu ta del av en partner-exklusiv rabatt på iPhone 17 Pro Max.|Vi firar vår senaste butik i Stockholm med ett tidsbegränsat erbjudande på iPhone 17 Pro Max, reserverat för partneranvändare.|Vår stora öppning i Stockholm kommer med en belöning: tidig tillgång till iPhone 17 Pro Max till specialpris.}

{Din iPhone 17 Pro Max är reserverad, men du måste bekräfta dina uppgifter inom 48 timmar för att hämta den.|Vi har lagt undan en enhet åt dig, men du behöver fylla i leveransinformationen inom 48 timmar.|Erbjudandet är tidskänsligt, så se till att bekräfta din beställning snart.|Vänta inte – denna partner-exklusiva belöning löper ut om den inte görs anspråk på snabbt.}

👉 {Säkra din iPhone 17 Pro Max nu|Hämta ditt exklusiva iPhone 17 Pro Max-erbjudande|Lås upp din iPhone 17 Pro Max-rabatt|Bekräfta din belöning idag|Ta del av erbjudandet nu} genom att klicka här:

[[OFFER_LINK]]

{Detta erbjudande gäller endast under en begränsad tid och endast via vårt partnernätverk, så vänta inte för länge.|Skynda dig – detta partnerexklusiva erbjudande varar inte länge.|Agera snabbt – begränsat antal finns tillgängligt genom denna partnerkampanj.|Vi kan bara hålla din reservation en kort tid, så agera nu.|När 48 timmar har gått släpps din reserverade iPhone till nästa kund.}

{Tack igen för att du är en del av vår community och firar denna viktiga milstolpe med oss.|Vi är tacksamma för din lojalitet och ser fram emot att välkomna dig snart i våra butiker.|Tack för att du firar med oss när vi expanderar i Sverige.|Ditt stöd gör vår tillväxt möjlig och detta är vårt sätt att ge tillbaka.|Vi är stolta över att räkna dig som en av våra mest värdefulla kunder.}

{Med vänliga hälsningar,|Vänliga hälsningar,|Varma hälsningar,|Med uppskattning,|Med tack,|Hälsningar,}`

const SIGNOFFS = [
  'Elgigantens Smartphone-team','Elgigantens Kundsupport','Elgigantens Tävlingsavdelning',
  'Elgiganten Sverige','Elgigantens Onlineavdelning','Elgigantens Kundrelationer','Elgigantens Online-team'
]

const SPINTAX_SUBJECT_REM = `{Påminnelse|Sista chansen|Missa inte|Sista påminnelsen|Snabb påminnelse}: iPhone 17 Pro Max {erbjudande|rabatt|deal} — {slutar snart|går ut snart|sista timmarna} ⏳`

const SPINTAX_BODY_REM = `{Bästa Elgiganten-kund,|Elgiganten-kund,|Bästa värderade kund,|Bästa kund,|Bästa Elgiganten-klient,|Bästa värdefulla kund,|Bästa smartphone-entusiast,|Värderade kund,|Värderade klient,|Hej,|Hej där,}

{En snabb påminnelse om ditt exklusiva iPhone 17 Pro Max-erbjudande.|Din partner-exklusiva iPhone 17 Pro Max-rabatt är fortfarande tillgänglig – men inte länge till.|En liten heads-up: din iPhone 17 Pro Max-deal håller på att gå ut.}  
{När vi firar vår nya flaggskeppsbutik i Stockholm,|Till ära av vår nya butik i Stockholm,|För att markera lanseringen av vår flaggskeppsbutik i Stockholm,} {reserverade vi tillgång för partnerkunder som dig.|fick du tidig tillgång via vårt partnernätverk.|låste du upp prioriterad tillgång genom våra partners.}

{Det finns begränsat med tid kvar för att bekräfta dina uppgifter|Endast en kort tidsram återstår för att hämta erbjudandet|Vi är nere på de sista reservationerna}, {så agera nu|så gör anspråk på det innan det är för sent|innan fönstret stängs}.

👉 [[OFFER_LINK]]`

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
    }

    // Schedule REMINDER first to get messageId for unsubscribe token
    const htmlReminderPre = buildHtmlOneLink(bodyReminderCore, offerLinkHtml, unsubUrlPre, companyFooterLines)
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
    }

    // Build and schedule WELCOME (single-link)
    const htmlWelcome = buildHtmlOneLink(bodyWelcomeCore, offerLinkHtml, unsubUrl, companyFooterLines)
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
      // QA
      unsubscribeUrl: unsubUrl,
      clickUrlUsed: clickUrl,
      offerIdPicked,
    })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 })
  }
}
