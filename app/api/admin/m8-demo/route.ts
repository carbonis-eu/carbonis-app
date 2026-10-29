import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateEmailPreview } from '@/lib/m8/generate-email'

export const dynamic = 'force-dynamic'

const BREVO_API_KEY = process.env.BREVO_API_KEY!

function buildDemoHtml(body: string, ctaUrl: string): string {
  const urlRegex = /https:\/\/carbonis\.eu\/za\/[a-z0-9-]+/
  const textWithoutUrl = body.replace(urlRegex, '').replace(/\s*—\s*$/, '').replace(/:\s*$/, '')
  const paragraphs = textWithoutUrl
    .split(/\n\n+/)
    .map(p => p.trim()).filter(Boolean)
    .map(p => `<p style="margin:0 0 16px;line-height:1.6;color:#1e293b;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="sl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#0f2d5a;padding:16px 28px;">
      <span style="color:#ffffff;font-weight:800;font-size:17px;">Carbonis</span>
      <span style="color:#93c5fd;font-size:12px;margin-left:8px;">EU Compliance</span>
    </div>
    <div style="padding:28px 28px 8px;">${paragraphs}</div>
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${ctaUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        Oglejte si svojo analizo →
      </a>
    </div>
    <p style="text-align:center;font-size:12px;color:#94a3b8;margin:8px 0 20px;">Analiza je brezplačna in brez obveznosti</p>
    <div style="padding:16px 28px;border-top:1px solid #f1f5f9;">
      <p style="margin:0;font-size:13px;color:#64748b;">Brane | <a href="https://carbonis.eu" style="color:#1d4ed8;">carbonis.eu</a></p>
      <p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;">⚠️ To je DEMO email — za testne namene</p>
    </div>
  </div>
</body></html>`
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const metaRole = (user.app_metadata as Record<string, string> | null)?.role
  if (metaRole !== 'admin' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { to_email } = await req.json() as { to_email: string }
  const db = createAdminClient()

  // Demo prospect data
  const demoProspect = {
    company_name: 'Brane Test Avtoservis',
    industry: 'avtoservis' as const,
    city: 'Ljubljana',
    google_rating: 4.5,
    google_reviews_count: 50,
    website: 'https://example.com',
    recommended_package: 'growth',
    pain_points: ['pasivna baza strank', 'manjkajoče ocene'],
    ai_notes: null,
  }

  // Upsert demo prospect in DB so landing page works
  const slug = 'brane-test-avtoservis'
  const { data: existing } = await db.from('prospects').select('id').eq('company_name', demoProspect.company_name).single()
  if (!existing) {
    await db.from('prospects').insert({
      ...demoProspect,
      status: 'scored',
      lead_score: 8,
      email: to_email,
    })
  }

  // Generate email
  const generated = await generateEmailPreview(demoProspect)
  const ctaUrl = `https://carbonis.eu/za/${slug}`
  const html = buildDemoHtml(generated.body, ctaUrl)

  // Send via Brevo
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'Brane | carbonis.eu', email: 'info@carbonis.eu' },
      to: [{ email: to_email }],
      subject: generated.subject + ' [DEMO]',
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ ok: true, subject: generated.subject, landing_url: ctaUrl })
}
