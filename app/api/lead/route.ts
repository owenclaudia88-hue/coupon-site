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

// --- spintax expander (Edge-safe) ---
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

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// HMAC (for unsubscribe token)
async function hmac(payload: string, secret: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  const b = Buffer.from(sigBuf)
  return b.toString('base64url')
}

// Optional: hash email to store unsubscribe marker without exposing the address
async function sha256Hex(s: string) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(s))
  return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('')
}

// --- SWEDISH SPINTAX (MAIN + REMINDER) ---
const SPINTAX_SUBJECT_MAIN = `{Exklusivt|Speciellt|Begränsat tillfälle|Grattis!|Du har blivit utvald till ett|Missa inte detta} iPhone 17 Pro Max {erbjudande|deal|rabatt|belöning} — {för att fira vår flaggskeppsbutik|för att fira vår nya butik i Stockholm|som en del av vår stora öppning i Stockholm|tillgängligt endast via vårt partnernätverk} 🎉`

const SPINTAX_BODY_MAIN_BASE = `{Bästa Elgiganten-kund,|Elgiganten-kund,|Bästa värderade kund,|Bästa kund,|Bästa Elgiganten-klient,|Bästa värdefulla kund,|Bästa smartphone-entusiast,|Värderade kund,|Värderade klient,|Hej,|Hej där,}

{Tack för att du registrerade dig via en av våra betrodda partnersajter.|Vi är glada att du har gått med oss genom en av våra partnerplattformar.|Tack för att du anmälde dig via en av våra partnersidor.|Vi uppskattar att du gick med oss via vårt partnernätverk.}  
{Vi samarbetar med utvalda partners för att kunna erbjuda de mest exklusiva erbjudandena,|Genom att samarbeta med ledande sajter kan vi dela oslagbara deals,|Med våra betrodda partners kan vi leverera unika rabatter,} och idag {har vi något speciellt reserverat för dig.|är vi glada att dela ett unikt tillfälle.|har du låst upp en exklusiv belöning.}

---

{För att fira öppningen av vår flaggskeppsbutik i Stockholm ger vi tidig tillgång till en exklusiv iPhone 17 Pro Max-rabatt.|Som en del av vår nya butikslansering i Stockholm kan du nu ta del av en partner-exklusiv rabatt på iPhone 17 Pro Max.|Vi firar vår senaste butik i Stockholm med ett tidsbegränsat erbjudande på iPhone 17 Pro Max, reserverat för partneranvändare.|Vår stora öppning i Stockholm kommer med en belöning: tidig tillgång till iPhone 17 Pro Max till specialpris.}

{Din iPhone 17 Pro Max är reserverad, men du måste bekräfta dina uppgifter inom 48 timmar för att hämta den.|Vi har lagt undan en enhet åt dig, men du behöver fylla i leveransinformationen inom 48 timmar.|Erbjudandet är tidskänsligt, så se till att bekräfta din beställning snart.|Vänta inte – denna partner-exklusiva belöning löper ut om den inte görs anspråk på snabbt.}

---

👉 {Säkra din iPhone 17 Pro Max nu|Hämta ditt exklusiva iPhone 17 Pro Max-erbjudande|Lås upp din iPhone 17 Pro Max-rabatt|Bekräfta din belöning idag|Ta del av erbjudandet nu} genom att besöka en av dessa länkar:  

{http://bit.ly/4gF6Gje
|https://bit.ly/3InCcFG
|https://bit.ly/48sgGtQ
|https://bit.ly/3IrWQ7w
|https://bit.ly/4nc5beu
|https://tinyurl.com/cd58a8w
|https://tinyurl.com/5aphht4b
|https://tinyurl.com/r7j5utdj
|https://tinyurl.com/bp5wnra8
|https://tinyurl.com/yc63mu8v}

---

{Detta erbjudande gäller endast under en begränsad tid och endast via vårt partnernätverk, så vänta inte för länge.|Skynda dig – detta partnerexklusiva erbjudande varar inte länge.|Agera snabbt – begränsat antal finns tillgängligt genom denna partnerkampanj.|Vi kan bara hålla din reservation en kort tid, så agera nu.|När 48 timmar har gått släpps din reserverade iPhone till nästa kund.}

---

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

{Det finns begränsat med tid kvar för att bekräfta dina uppgifter|Endast en kort tidsram återstår för att hämta erbjudandet|Vi är nere på de sista reservationerna}, {så agera nu|så gör anspråk på det innan det är för sent|innan fönstret stängs}.`

// helper to build the List-Unsubscribe header (mailto + https)
function listUnsubHeader(unsubUrl: string, mailto?: string) {
  const parts = []
  if (mailto) parts.push(`<mailto:${mailto}>`)
  parts.push(`<${unsubUrl}>`)
  return parts.join(', ')
}

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

    // ---- Save lead (as you had) ----
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

    // ---- Email scheduling params ----
    const apiKey = process.env.BREVO_API_KEY
    const fromEmail = process.env.BREVO_SENDER_EMAIL || 'olivia@elgigantensupport.online'
    const fromName  = process.env.BREVO_SENDER_NAME  || 'Olivia'
    const listUnsubMail = process.env.UNSUB_MAILTO || '' // optional, e.g. unsubscribe@yourdomain

    if (!apiKey) {
      console.warn('BREVO_API_KEY missing — lead stored but email not scheduled.')
      return NextResponse.json({ ok: true, leadKey: key, emailScheduled: false })
    }

    const url = new URL(req.url)
    const origin = `${url.protocol}//${url.host}` // for unsubscribe link
    const delayMin = Math.max(0, Number(url.searchParams.get('delayMin') ?? '15'))
    const reminderHours = Math.max(1, Number(url.searchParams.get('reminderHours') ?? '24'))

    const scheduledAtWelcome = new Date(Date.now() + delayMin * 60 * 1000).toISOString()
    const scheduledAtReminder = new Date(Date.now() + reminderHours * 60 * 60 * 1000).toISOString()

    // Expand main subject/body
    const subjectWelcome = expandSpintax(SPINTAX_SUBJECT_MAIN)
    const signoff = SIGNOFFS[Math.floor(Math.random() * SIGNOFFS.length)]
    const bodyWelcomeCore = expandSpintax(SPINTAX_BODY_MAIN_BASE) + `

**${signoff}**`

    // We'll create the reminder first to get its messageId for the unsubscribe token
    async function scheduleBrevo(subject: string, htmlContent: string, whenISO: string, headers: Record<string,string>) {
      return fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey! },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: normalizedEmail, name: [firstName, lastName].filter(Boolean).join(' ') || normalizedEmail }],
          subject,
          htmlContent,
          headers,
          scheduledAt: whenISO,
        }),
      })
    }

    // Temporarily send a placeholder for reminder to get its messageId
    const subjectReminderTmp = expandSpintax(SPINTAX_SUBJECT_REM)
    const bodyReminderCore = expandSpintax(SPINTAX_BODY_REM) + `

**${signoff}**`

    // Build a temporary unsubscribe URL (we'll rebuild after we know messageId too)
    const tsNow = Date.now()
    const preToken = `${normalizedEmail}|pending|${tsNow}`
    const sigPre = process.env.UNSUB_SECRET ? await hmac(preToken, process.env.UNSUB_SECRET) : 'nosig'
    const unsubUrlPre = `${origin}/api/unsubscribe?e=${encodeURIComponent(normalizedEmail)}&m=pending&t=${tsNow}&sig=${sigPre}`

    const baseHeaders = {
      'X-Entity-Ref-ID': `lead-${id}`,
      'List-Unsubscribe': listUnsubHeader(unsubUrlPre, listUnsubMail || undefined),
    }

    // schedule REMINDER first (so we can embed its messageId into the welcome's unsubscribe link)
    const resReminder = await scheduleBrevo(
      subjectReminderTmp,
      `<pre style="font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;line-height:1.55;margin:0;">${escapeHtml(bodyReminderCore)}\n\nAvsluta prenumeration: ${unsubUrlPre}</pre>`,
      scheduledAtReminder,
      baseHeaders
    )
    let reminderOk = resReminder.ok
    const reminderData = reminderOk ? await resReminder.json().catch(() => ({})) : null
    const reminderMsgId = reminderData?.messageId || 'pending'

    // Real unsubscribe link containing the reminder messageId so we can cancel it on click
    const tokenPayload = `${normalizedEmail}|${reminderMsgId}|${tsNow}`
    const sig = process.env.UNSUB_SECRET ? await hmac(tokenPayload, process.env.UNSUB_SECRET) : 'nosig'
    const unsubUrl = `${origin}/api/unsubscribe?e=${encodeURIComponent(normalizedEmail)}&m=${encodeURIComponent(reminderMsgId)}&t=${tsNow}&sig=${sig}`
    const headersWithUnsub = {
      ...baseHeaders,
      'List-Unsubscribe': listUnsubHeader(unsubUrl, listUnsubMail || undefined),
    }

    // Now schedule the WELCOME with the final unsubscribe link in body + header
    const htmlWelcome = `<pre style="font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;line-height:1.55;margin:0;">${escapeHtml(bodyWelcomeCore)}\n\nAvsluta prenumeration: ${unsubUrl}</pre>`

    const resWelcome = await scheduleBrevo(subjectWelcome, htmlWelcome, scheduledAtWelcome, headersWithUnsub)
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
      unsubscribeUrl: unsubUrl, // for debugging/QA
    })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 })
  }
}
