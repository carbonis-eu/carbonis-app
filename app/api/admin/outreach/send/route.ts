import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'

const SIGNATURE_SL = `\n\nLep pozdrav,\nBrane Recek\nCarbonis | carbonis.eu\ninfo@carbonis.eu\n\nP.S. Odjavite se kadarkoli — samo odgovorite s "ODJAVA".`
const SIGNATURE_DE = `\n\nMit freundlichen Grüßen,\nBrane Recek\nCarbonis | carbonis.eu\ninfo@carbonis.eu\n\nP.S. Zum Abbestellen antworten Sie mit "ABMELDEN".`
const SIGNATURE_EN = `\n\nBest regards,\nBrane Recek\nCarbonis | carbonis.eu\ninfo@carbonis.eu\n\nP.S. To unsubscribe, reply with "UNSUBSCRIBE".`

function getSignature(lang: string) {
  if (lang === 'sl') return SIGNATURE_SL
  if (lang === 'de') return SIGNATURE_DE
  return SIGNATURE_EN
}

export async function POST(request: NextRequest) {
  const { prospect_id, subject, body, language = 'en' } = await request.json() as {
    prospect_id: string
    subject: string
    body: string
    language?: string
  }

  if (!prospect_id || !subject || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const adminDb = createAdminClient()
  const { data: prospect, error: fetchErr } = await adminDb
    .from('outreach_prospects')
    .select('contact_email, company_name, status')
    .eq('id', prospect_id)
    .single()

  if (fetchErr || !prospect?.contact_email) {
    return NextResponse.json({ error: 'Prospect not found or missing email' }, { status: 404 })
  }

  if (prospect.status === 'email_sent') {
    return NextResponse.json({ error: 'Email already sent to this prospect' }, { status: 409 })
  }

  const transport = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  })

  const fullBody = body + getSignature(language)

  try {
    await transport.sendMail({
      from: `"Carbonis" <info@carbonis.eu>`,
      to: prospect.contact_email,
      subject,
      text: fullBody,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'SMTP error'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  // Update prospect status + log email
  await adminDb.from('outreach_prospects').update({
    status: 'email_sent',
    email_sent_at: new Date().toISOString(),
    email_subject: subject,
    email_body: fullBody,
    updated_at: new Date().toISOString(),
  }).eq('id', prospect_id)

  await adminDb.from('crm_activity').insert({
    prospect_id,
    type: 'email_sent',
    subject,
    body: fullBody,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
