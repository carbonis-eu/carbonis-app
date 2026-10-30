export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface LeadPayload {
  contact_name: string
  company_name: string
  email: string
  industry: string
  estimated_contacts: string
  recommended_package: string
  estimated_roi_eur: number | null
  gdpr_consent: boolean
  conversation_log: Array<{ role: string; content: string }>
}

async function sendBrevoEmail(to: string, toName: string, subject: string, html: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new Error('BREVO_API_KEY not set')

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Carbonis', email: 'info@carbonis.eu' },
      to: [{ name: toName, email: to }],
      subject,
      htmlContent: html,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Brevo error: ${err}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json()

    const {
      contact_name,
      company_name,
      email,
      industry,
      estimated_contacts,
      recommended_package,
      estimated_roi_eur,
      gdpr_consent,
      conversation_log,
    } = body

    if (!contact_name || !company_name || !email || !industry) {
      return NextResponse.json({ ok: false, error: 'Manjkajo obvezna polja' }, { status: 400 })
    }

    // Save to Supabase
    const db = createAdminClient()
    const { data: insertedLead, error: dbError } = await db.from('organic_leads').insert({
      contact_name,
      company_name,
      email,
      industry,
      estimated_contacts,
      recommended_package,
      estimated_roi_eur,
      gdpr_consent,
      gdpr_consent_at: gdpr_consent ? new Date().toISOString() : null,
      source: 'vera_chatbot',
      conversation_log: conversation_log ?? [],
    }).select('id').single()

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      return NextResponse.json({ ok: false, error: dbError.message }, { status: 500 })
    }
    const leadId: string = insertedLead?.id ?? ''

    const roiStr = estimated_roi_eur ? `${estimated_roi_eur.toLocaleString('sl-SI')} €/mes` : 'individualno'

    // Draft email for admin to review & send manually
    const emailDraftHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:Arial,sans-serif;color:#0f172a;margin:0;padding:0;background:#f8fafc}
.container{max-width:560px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.header{background:#1E7A56;padding:32px;text-align:center}
.header h1{color:white;margin:0;font-size:24px}
.header p{color:rgba(255,255,255,.7);margin:8px 0 0;font-size:14px}
.body{padding:32px}
.roi-box{background:#ecfdf5;border:1.5px solid #1E7A56;border-radius:12px;padding:20px 24px;margin:24px 0;text-align:center}
.roi-box .amount{font-size:32px;font-weight:800;color:#1E7A56}
.roi-box .label{color:#64748b;font-size:13px;margin-top:4px}
.info-table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
.info-table td{padding:8px 0;border-bottom:1px solid #f1f5f9}
.info-table td:first-child{color:#64748b;width:40%}
.info-table td:last-child{font-weight:600}
.cta{display:block;text-align:center;margin:24px 0 8px;padding:14px 28px;background:#1E7A56;color:white;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px}
.footer{background:#f8fafc;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0}
</style></head><body>
<div class="container">
  <div class="header"><h1>Vaša ponudba Carbonis</h1><p>Personalizirana analiza za ${company_name}</p></div>
  <div class="body">
    <p>Pozdravljeni, ${contact_name}!</p>
    <p>Hvala za pogovor z Vero. Na podlagi vaših podatkov smo pripravili oceno potenciala za vaše podjetje.</p>
    ${estimated_roi_eur ? `<div class="roi-box"><div class="amount">${estimated_roi_eur.toLocaleString('sl-SI')} €</div><div class="label">ocenjen mesečni potencial reaktivacije</div></div>` : ''}
    <table class="info-table">
      <tr><td>Podjetje</td><td>${company_name}</td></tr>
      <tr><td>Panoga</td><td>${industry}</td></tr>
      <tr><td>Baza kontaktov</td><td>${estimated_contacts}</td></tr>
      <tr><td>Priporočen paket</td><td>${recommended_package}</td></tr>
      <tr><td>ROI potencial</td><td>${roiStr}</td></tr>
    </table>
    <p>Naša ekipa se vam bo javila v najkrajšem možnem času z individualno ponudbo.</p>
    <a href="https://carbonis.eu" class="cta">Oglejte si Carbonis →</a>
  </div>
  <div class="footer">Carbonis d.o.o. · info@carbonis.eu · carbonis.eu</div>
</div></body></html>`

    // Save email draft for admin preview
    if (leadId) {
      await db.from('organic_leads').update({ email_draft: emailDraftHtml }).eq('id', leadId)
    }

    // Admin notification email
    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body { font-family: Arial, sans-serif; color: #0f172a; }
table { border-collapse: collapse; width: 100%; }
td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
td:first-child { background: #f8fafc; color: #64748b; width: 35%; font-weight: 600; }
h2 { color: #0B2471; }
</style></head>
<body>
<h2>🆕 NOVA STRANKA — Vera chatbot</h2>
<table>
  <tr><td>Ime</td><td>${contact_name}</td></tr>
  <tr><td>Podjetje</td><td>${company_name}</td></tr>
  <tr><td>Email</td><td>${email}</td></tr>
  <tr><td>Panoga</td><td>${industry}</td></tr>
  <tr><td>Baza kontaktov</td><td>${estimated_contacts}</td></tr>
  <tr><td>Paket</td><td>${recommended_package}</td></tr>
  <tr><td>ROI potencial</td><td>${roiStr}</td></tr>
  <tr><td>GDPR</td><td>${gdpr_consent ? '✓ DA' : '✗ NE'}</td></tr>
  <tr><td>Čas</td><td>${new Date().toLocaleString('sl-SI')}</td></tr>
</table>
</body>
</html>`

    // Admin notification only (lead email is sent manually via admin panel)
    try {
      await sendBrevoEmail('info@carbonis.eu', 'Carbonis Admin', 'NOVA STRANKA — Vera chatbot', adminHtml)
    } catch (emailErr) {
      console.error('Admin email failed:', emailErr)
    }

    return NextResponse.json({ ok: true, lead_id: leadId })
  } catch (err) {
    console.error('vera/lead error:', err)
    return NextResponse.json({ ok: false, error: 'Napaka strežnika' }, { status: 500 })
  }
}
