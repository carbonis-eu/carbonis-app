import { createAdminClient } from '@/lib/supabase/admin'

const GEMINI_KEY = process.env.GEMINI_API_KEY!
const BREVO_API_KEY = process.env.BREVO_API_KEY!
const FROM_EMAIL = 'info@carbonis.eu'
const FROM_NAME = 'Brane | carbonis.eu'

const PACKAGE_NAMES: Record<string, string> = {
  starter: 'Starter (€149/mes)',
  growth: 'Growth (€249/mes)',
  pro: 'Pro (€349/mes)',
}

const SYSTEM_PROMPT = `Si izkušen B2B prodajalec ki piše kratke, osebne emaile slovenskim lastnikom lokalnih podjetij. Cilj emaila: da lastnik klikne link in pogleda svojo analizo.

EMAIL STRUKTURA (3 kratki odstavki):

1. OPAŽANJE (1-2 stavki): Konkretno o njihovem podjetju. Pohvali + nakaži izgubljen potencial. Primer: "Vidim, da ima [ime] solidnih [X] ocen v Google Maps — ampak pri povprečju [Y] verjetno vsak teden izgubite [Z]% strank preden sploh pokličejo."

2. KAJ TO POMENI ZA VAS (2 stavki): Konkreten izračun ali primer iz panoge. Koliko strank/denarja gre mimo. Primer: "Avtoservisi z oceno nad 4.6 dobijo v povprečju 30% več klicev iz Google Maps. Za servis vaše velikosti je to cca 8-12 strank na mesec več — brez dodatnega oglaševanja."

3. CTA (1-2 stavki): Ponudi brezplačno analizo. "Pripravil sem kratko analizo za [ime] — vidite točno kje izgubljate stranke in kaj bi konkretno spremenili: [PERSONALIZED_LINK]"

Podpis: Brane | carbonis.eu
Footer: Ne želite več? [odjava]

PRAVILA:
- Max 90 besed (brez podpisa in footerja)
- Vsak stavek mora pokazati: prihranek časa, prihranek denarja ALI več strank
- Konkretni številki vedno boljši kot splošne besede — izračunaj na podlagi panoge in ratinga
- Piši brez nagovora (ne "Spoštovani", ne "Pozdravljeni")
- BREZ garancij, BREZ cen, BREZ "Odgovorite z DA", BREZ hvalisanja
- [PERSONALIZED_LINK] zamenjaj z vrednostjo iz prompta
- NIKOLI ne omeni AI, algoritmov, avtomatizacije, platform`

type EmailType = 'initial' | 'followup_1' | 'followup_2' | 'followup_3' | 'demo_link' | 'final_attempt'

interface GeneratedEmail {
  subject: string
  body: string
}

export async function generateEmailPreview(prospectData: {
  prospect_id?: string
  company_name: string
  industry: string | null
  city: string | null
  google_rating: number | null
  google_reviews_count: number | null
  website: string | null
  recommended_package: string | null
  pain_points: string[] | null
  ai_notes: string | null
}): Promise<{ subject: string; body: string }> {
  return generateWithClaude(prospectData, 'initial')
}

async function generateWithClaude(prospectData: {
  prospect_id?: string
  company_name: string
  industry: string | null
  city: string | null
  google_rating: number | null
  google_reviews_count: number | null
  website: string | null
  recommended_package: string | null
  pain_points: string[] | null
  ai_notes: string | null
}, emailType: EmailType): Promise<GeneratedEmail> {

  const typeContext: Record<EmailType, string> = {
    initial: 'To je prvi email. Bodi direkten in specifičen.',
    followup_1: 'Prejšnji email ni dobil odgovora (5 dni). Kratek reminder — "Imate kakšno vprašanje?"',
    followup_2: 'Drugi followup (10 dni). Drugačen kot prvi — vpraša o njihovi NAJVEČJI težavi s strankami.',
    followup_3: 'Zadnji followup (15 dni). Jasno da je zadnji. Poudarek na garanciji.',
    demo_link: 'Stranka je odgovorila z DA! Pošlji demo link in nadaljnje korake.',
    final_attempt: '90 dni po koncu. Popolnoma svež pristop, ne omeni prejšnjih emailov.',
  }

  const pkg = prospectData.recommended_package
    ? PACKAGE_NAMES[prospectData.recommended_package] ?? prospectData.recommended_package
    : 'Starter'

  const slug = prospectData.company_name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40)
  const personalizedLink = `https://carbonis.eu/za/${slug}`

  const prompt = `Tip emaila: ${typeContext[emailType]}

Podjetje: ${prospectData.company_name}
Branža: ${prospectData.industry ?? 'lokalno podjetje'}
Mesto: ${prospectData.city ?? 'Slovenija'}
Google ocena: ${prospectData.google_rating ?? 'ni podatka'} (${prospectData.google_reviews_count ?? 0} ocen)
Spletna stran: ${prospectData.website ? 'DA' : 'NE'}
Priporočen paket: ${pkg}
Opaženi problemi: ${prospectData.pain_points?.join(', ') ?? prospectData.ai_notes ?? '-'}

PERSONALIZED_LINK: ${personalizedLink}

Vrni SAMO veljaven JSON:
{
  "subject": "<zadeva emaila>",
  "body": "<telo emaila v navadnem tekstu, z \\n za prelome vrstic>"
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
      }),
    }
  )

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> }
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(json) as GeneratedEmail
}

function buildHtmlEmail(body: string, prospectId: string): string {
  const unsubUrl = `https://carbonis.eu/api/unsubscribe?id=${prospectId}`

  // Extract personalized link from body and replace with button
  const urlRegex = /https:\/\/carbonis\.eu\/za\/[a-z0-9-]+/
  const match = body.match(urlRegex)
  const ctaUrl = match ? match[0] : null

  // Convert plain text to HTML paragraphs, remove the inline URL
  const textWithoutUrl = ctaUrl ? body.replace(urlRegex, '').replace(/\s*—\s*$/, '').replace(/:\s*$/, '') : body
  const paragraphs = textWithoutUrl
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin:0 0 16px;line-height:1.6;color:#1e293b;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  const button = ctaUrl ? `
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${ctaUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
        Oglejte si svojo analizo →
      </a>
    </div>
    <p style="text-align:center;font-size:12px;color:#94a3b8;margin:8px 0 0;">Analiza je brezplačna in brez obveznosti</p>
  ` : ''

  return `<!DOCTYPE html>
<html lang="sl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#0f2d5a;padding:16px 28px;">
      <span style="color:#ffffff;font-weight:800;font-size:17px;letter-spacing:-0.3px;">Carbonis</span>
      <span style="color:#93c5fd;font-size:12px;margin-left:8px;">EU Compliance</span>
    </div>
    <div style="padding:28px 28px 8px;">
      ${paragraphs}
    </div>
    ${button}
    <div style="padding:20px 28px;border-top:1px solid #f1f5f9;margin-top:16px;">
      <p style="margin:0;font-size:13px;color:#64748b;">Brane | <a href="https://carbonis.eu" style="color:#1d4ed8;">carbonis.eu</a></p>
      <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;">
        Ne želite več sporočil? <a href="${unsubUrl}" style="color:#94a3b8;">Odjavite se tukaj</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

async function sendViaBrevo(to: string, subject: string, body: string, prospectId: string): Promise<string | null> {
  const htmlContent = buildHtmlEmail(body, prospectId)

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Brevo error ${res.status}: ${err}`)
  }
  const data = await res.json() as { messageId?: string }
  return data.messageId ?? null
}

export async function generateAndSendEmail(
  prospectId: string,
  emailType: EmailType = 'initial'
): Promise<boolean> {
  const db = createAdminClient()

  const { data: prospect } = await db
    .from('prospects')
    .select('*')
    .eq('id', prospectId)
    .single()

  if (!prospect?.email) {
    console.log(`[m8-email] no email for prospect ${prospectId}`)
    return false
  }

  try {
    const generated = await generateWithClaude(prospect, emailType)
    const messageId = await sendViaBrevo(prospect.email, generated.subject, generated.body, prospectId)

    // Log the email
    await db.from('email_logs').insert({
      prospect_id: prospectId,
      email_type: emailType,
      subject: generated.subject,
      body: generated.body,
      sent_at: new Date().toISOString(),
      brevo_message_id: messageId,
      status: 'sent',
    })

    // Update prospect status
    const newStatus = emailType === 'initial' ? 'email_sent'
      : emailType === 'demo_link' ? 'replied_yes'
      : prospect.status

    await db.from('prospects').update({
      status: newStatus,
      last_action_at: new Date().toISOString(),
    }).eq('id', prospectId)

    console.log(`[m8-email] sent ${emailType} to ${prospect.email} (${prospect.company_name})`)
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[m8-email] error:', msg)
    await db.from('m8_error_logs').insert({
      step: 'email',
      error: msg,
      context: { prospect_id: prospectId, email_type: emailType },
    })
    return false
  }
}
