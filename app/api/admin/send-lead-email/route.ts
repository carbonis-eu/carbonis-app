import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { lead_id } = await req.json() as { lead_id: string }
    if (!lead_id) return NextResponse.json({ ok: false, error: 'Manjka lead_id' }, { status: 400 })

    const db = createAdminClient()
    const { data: lead, error: fetchErr } = await db
      .from('organic_leads')
      .select('email, contact_name, email_draft')
      .eq('id', lead_id)
      .single()

    if (fetchErr || !lead) return NextResponse.json({ ok: false, error: 'Lead ni najden' }, { status: 404 })
    if (!lead.email_draft) return NextResponse.json({ ok: false, error: 'Email osnutek ni na voljo' }, { status: 400 })

    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) return NextResponse.json({ ok: false, error: 'Email ni konfiguriran' }, { status: 503 })

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Carbonis', email: 'info@carbonis.eu' },
        to: [{ name: lead.contact_name ?? '', email: lead.email }],
        subject: `${lead.contact_name}, tu je vaša analiza potenciala`,
        htmlContent: lead.email_draft,
      }),
    })

    if (!brevoRes.ok) {
      const errText = await brevoRes.text()
      return NextResponse.json({ ok: false, error: `Brevo: ${errText}` }, { status: 502 })
    }

    // Mark as sent
    await db.from('organic_leads')
      .update({ email_sent_at: new Date().toISOString(), status: 'contacted' })
      .eq('id', lead_id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
