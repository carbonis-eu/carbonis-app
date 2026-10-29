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

const SYSTEM_PROMPT = `Si prodajni strokovnjak. Pišeš cold email v slovenščini za lokalna podjetja.

PRAVILA (striktno):
- Max 130 besed celoten email
- BREZ žargona, BREZ "Spoštovani", BREZ "Upam da ste dobro"
- Začni z enim specifičnim opažanjem o NJIHOVEM podjetju (Google ocena, brez spleta...)
- En konkreten ROI: "Pri avtoservisih s 3.8 oceno tipično reaktiviramo 15-20 strank v prvem mesecu"
- Garancija: 10 reaktiviranih strank v 60 dneh ali vrnemo denar
- En CTA: samo "Odgovorite z DA"
- Podpis: Brane | carbonis.eu | 041 xxx xxx
- Footer: Ne želite več? [odjava]
- NIKOLI ne omeni AI, robotov, avtomatizacije, algoritmov
- Piši kot človek ki je opazil problem med brskanjem`

type EmailType = 'initial' | 'followup_1' | 'followup_2' | 'followup_3' | 'demo_link' | 'final_attempt'

interface GeneratedEmail {
  subject: string
  body: string
}

async function generateWithClaude(prospectData: {
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

  const prompt = `Tip emaila: ${typeContext[emailType]}

Podjetje: ${prospectData.company_name}
Branža: ${prospectData.industry ?? 'lokalno podjetje'}
Mesto: ${prospectData.city ?? 'Slovenija'}
Google ocena: ${prospectData.google_rating ?? 'ni podatka'} (${prospectData.google_reviews_count ?? 0} ocen)
Spletna stran: ${prospectData.website ? 'DA' : 'NE'}
Priporočen paket: ${pkg}
Opaženi problemi: ${prospectData.pain_points?.join(', ') ?? prospectData.ai_notes ?? '-'}

${emailType === 'demo_link' ? `Demo link: https://carbonis.eu/demo` : ''}

Vrni SAMO veljaven JSON:
{
  "subject": "<zadeva emaila>",
  "body": "<telo emaila v navadnem tekstu, z \\n za prelome vrstic>"
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
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

async function sendViaBrevo(to: string, subject: string, body: string, prospectId: string): Promise<string | null> {
  const unsubUrl = `https://carbonis.eu/api/unsubscribe?id=${prospectId}`
  const fullBody = `${body}\n\n---\nNe želite več sporočil? ${unsubUrl}\nCarbonis d.o.o. | Xolo Go | EU`

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
      textContent: fullBody,
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
