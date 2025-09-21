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

// --- Simple spintax expander (Edge-safe) ---
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
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// --- SWEDISH SPINTAX (MAIN + REMINDER) ---

const SPINTAX_SUBJECT_MAIN = `{Exklusivt|Speciellt|Begränsat tillfälle|Grattis!|Du har blivit utvald till ett|Missa inte detta} iPhone 17 Pro Max {erbjudande|deal|rabatt|belöning} — {för att fira vår flaggskeppsbutik|för att fira vår nya butik i Stockholm|som en del av vår stora öppning i Stockholm|tillgängligt endast via vårt partnernätverk} 🎉`

const SPINTAX_BODY_MAIN = `{Bästa Elgiganten-kund,|Elgiganten-kund,|Bästa värderade kund,|Bästa kund,|Bästa Elgiganten-klient,|Bästa värdefulla kund,|Bästa smartphone-entusiast,|Värderade kund,|Värderade klient,|Hej,|Hej där,}

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

{Med vänliga hälsningar,|Vänliga hälsningar,|Varma hälsningar,|Med uppskattning,|Med tack,|Hälsningar,}  
**{Elgigantens Smartphone-team|Elgigantens Kundsupport|Elgigantens Tävlingsavdelning|Elgiganten Sverige|Elgigantens Onlineavdelning|Elgigantens Kundrelationer|Elgigantens Online-team}**`

const SPINTAX_SUBJECT_REM = `{Påminnelse|Sista chansen|Missa inte|Sista påminnelsen|Snabb påminnelse}: iPhone 17 Pro Max {erbjudande|rabatt|deal} — {slutar snart|går ut snart|sista timmarna} ⏳`

const SPINTAX_BODY_REM = `{Bästa Elgiganten-kund,|Elgiganten-kund,|Bästa värderade kund,|Bästa kund,|Bästa Elgiganten-klient,|Bästa värdefulla kund,|Bästa smartphone-entusiast,|Värderade kund,|Värderade klient,|Hej,|Hej där,}

{En snabb påminnelse om ditt exklusiva iPhone 17 Pro Max-erbjudande.|Din partner-exklusiva iPhone 17 Pro Max-rabatt är fortfarande tillgänglig – men inte länge till.|En liten heads-up: din iPhone 17 Pro Max-deal håller på att gå ut.}  
{När vi firar vår nya flaggskeppsbutik i Stockholm,|Till ära av vår nya butik i Stockholm,|För att markera lanseringen av vår flaggskeppsbutik i Stockholm,} {reserverade vi tillgång för partnerkunder som dig.|fick du tidig tillgång via vårt partnernätverk.|låste du upp prioriterad tillgång genom våra partners.}

{Det finns begränsat med tid kvar för att bekräfta dina uppgifter|Endast en kort tidsram återstår för att hämta erbjudandet|Vi är nere på de sista reservationerna}, {så agera nu|så gör anspråk på det innan det är för sent|innan fönstret stängs}.

👉 {Hämta din iPhone 17 Pro Max nu|Lås upp din exklusiva rabatt|Säkra ditt erbjudande|Bekräfta din belöning}:
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

{Detta är en tidsbegränsad partnerkampanj – när den är borta är den borta.|Vi kan bara hålla din reservation en kort stund – slutför den nu.|Sista påminnelsen: efter detta släpps din reserverade enhet.}

{Med vänliga hälsningar,|Vänliga hälsningar,|Varma hälsningar,|Med uppskattning,|Hälsningar,}  
**{Elgigantens Smartphone-team|Elgigantens Kundsupport|Elgigantens Tävlingsavdelning|Elgiganten Sverige|Elgigantens Onlineavdelning|Elgigantens Kundrelationer|Elgigantens Online-team}**

{PS: Denna påminnelse skickades eftersom du registrerade dig via en partnersajt.|PS: Du får denna påminnelse genom din registrering i vårt partnernätverk.|PS: Du kan ignorera detta meddelande om du redan har gjort anspråk på erbjudandet.}`

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

    // ---- Email scheduling ----
    const apiKey = process.env.BREVO_API_KEY
    const fromEmail = process.env.BREVO_SENDER_EMAIL || 'olivia@elgigantensupport.online'
    const fromName  = process.env.BREVO_SENDER_NAME  || 'Olivia'

    if (!apiKey) {
      console.warn('BREVO_API_KEY missing — lead stored but email not scheduled.')
      return NextResponse.json({ ok: true, leadKey: key, emailScheduled: false })
    }

    // Allow override for testing (e.g., /api/lead?delayMin=2&reminderHours=1)
    const url = new URL(req.url)
    const delayMin = Math.max(0, Number(url.searchParams.get('delayMin') ?? '15')) // default 15 minutes
    const reminderHours = Math.max(1, Number(url.searchParams.get('reminderHours') ?? '24')) // default 24 hours

    const sendAtWelcome = new Date(Date.now() + delayMin * 60 * 1000).toISOString()
    const sendAtReminder = new Date(Date.now() + reminderHours * 60 * 60 * 1000).toISOString()

    // Expand spintax for both emails (subject + body)
    const subjectWelcome = expandSpintax(SPINTAX_SUBJECT_MAIN)
    const bodyWelcome = expandSpintax(SPINTAX_BODY_MAIN)

    const subjectReminder = expandSpintax(SPINTAX_SUBJECT_REM)
    const bodyReminder = expandSpintax(SPINTAX_BODY_REM)

    // Minimal HTML wrapper (keeps line breaks)
    const htmlWelcome = `<pre style="font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;line-height:1.55;margin:0;">${escapeHtml(bodyWelcome)}</pre>`
    const htmlReminder = `<pre style="font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;line-height:1.55;margin:0;">${escapeHtml(bodyReminder)}</pre>`

    // Helper to send via Brevo
    async function sendBrevoEmail(subject: string, htmlContent: string, sendAtISO: string, ref: string) {
      return fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey!,
        },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: normalizedEmail, name: [firstName, lastName].filter(Boolean).join(' ') || normalizedEmail }],
          subject,
          htmlContent,
          headers: { 'X-Entity-Ref-ID': `${ref}-${key}` },
          sendAt: sendAtISO,
        }),
      })
    }

    // Send welcome (scheduled)
    const resWelcome = await sendBrevoEmail(subjectWelcome, htmlWelcome, sendAtWelcome, 'welcome')
    let welcomeOk = resWelcome.ok
    if (!welcomeOk) {
      const txt = await resWelcome.text().catch(() => '')
      console.error('Brevo welcome schedule error:', resWelcome.status, txt)
    }

    // Send reminder (scheduled +24h by default)
    const resReminder = await sendBrevoEmail(subjectReminder, htmlReminder, sendAtReminder, 'reminder')
    let reminderOk = resReminder.ok
    if (!reminderOk) {
      const txt = await resReminder.text().catch(() => '')
      console.error('Brevo reminder schedule error:', resReminder.status, txt)
    }

    // Try to parse Brevo responses (ignore failures)
    const brevoWelcome = welcomeOk ? await resWelcome.json().catch(() => ({})) : null
    const brevoReminder = reminderOk ? await resReminder.json().catch(() => ({})) : null

    return NextResponse.json({
      ok: true,
      leadKey: key,
      emailScheduled: welcomeOk,
      reminderScheduled: reminderOk,
      sendAtWelcome,
      sendAtReminder,
      brevoWelcome,
      brevoReminder,
    })
  } catch (err: any) {
    console.error('lead error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 })
  }
}
