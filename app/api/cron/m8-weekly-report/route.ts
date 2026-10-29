import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const REPORT_TO = 'branislav.recek@smartmoneysolutions.com'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createAdminClient()
  const weekEnd = new Date()
  const weekStart = new Date(weekEnd.getTime() - 7 * 86_400_000)
  const startISO = weekStart.toISOString()

  // Gather stats
  const [
    { count: newProspects },
    { count: emailsSent },
    { count: emailsOpened },
    { count: repliedYes },
    { count: repliedNo },
    { count: unsubscribed },
    { count: converted },
  ] = await Promise.all([
    db.from('prospects').select('*', { count: 'exact', head: true }).gte('created_at', startISO),
    db.from('email_logs').select('*', { count: 'exact', head: true }).gte('sent_at', startISO),
    db.from('email_logs').select('*', { count: 'exact', head: true }).gte('opened_at', startISO).not('opened_at', 'is', null),
    db.from('prospects').select('*', { count: 'exact', head: true }).eq('status', 'replied_yes').gte('last_action_at', startISO),
    db.from('prospects').select('*', { count: 'exact', head: true }).eq('status', 'replied_no').gte('last_action_at', startISO),
    db.from('prospects').select('*', { count: 'exact', head: true }).eq('status', 'unsubscribed').gte('last_action_at', startISO),
    db.from('prospects').select('*', { count: 'exact', head: true }).eq('status', 'converted').gte('converted_at', startISO),
  ])

  // Top prospects this week
  const { data: topProspects } = await db
    .from('prospects')
    .select('company_name, city, lead_score, status, recommended_package')
    .gte('created_at', startISO)
    .gte('lead_score', 7)
    .order('lead_score', { ascending: false })
    .limit(5)

  const fmt = (d: Date) => d.toLocaleDateString('sl-SI', { day: 'numeric', month: 'numeric', year: 'numeric' })
  const openRate = emailsSent ? Math.round(((emailsOpened ?? 0) / emailsSent) * 100) : 0

  const topHtml = (topProspects ?? []).map(p =>
    `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${p.company_name}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${p.city ?? '-'}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9;text-align:center"><strong>${p.lead_score}/10</strong></td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${p.status}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f1f5f9">${p.recommended_package ?? '-'}</td>
    </tr>`
  ).join('')

  const reportHtml = `<!DOCTYPE html>
<html><body style="font-family:monospace;background:#f8fafc;padding:24px">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
  <div style="background:#0B2471;padding:20px 24px">
    <h1 style="color:white;margin:0;font-size:18px">M8 — Tedenski report</h1>
    <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">${fmt(weekStart)} — ${fmt(weekEnd)}</p>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#64748b">🔍 Novih kontaktov</td><td style="padding:8px 0;text-align:right;font-weight:700">${newProspects ?? 0}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">📧 Emailov poslanih</td><td style="padding:8px 0;text-align:right;font-weight:700">${emailsSent ?? 0}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">👀 Odprtih</td><td style="padding:8px 0;text-align:right;font-weight:700">${emailsOpened ?? 0} <span style="color:#94a3b8;font-weight:400">(${openRate}%)</span></td></tr>
      <tr><td style="padding:8px 0;color:#64748b">✅ Odgovorilo z DA</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#15803d">${repliedYes ?? 0}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">❌ Odgovorilo z NE</td><td style="padding:8px 0;text-align:right;font-weight:700">${repliedNo ?? 0}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">🚫 Odjavljenih</td><td style="padding:8px 0;text-align:right;font-weight:700">${unsubscribed ?? 0}</td></tr>
      <tr style="border-top:2px solid #0B2471"><td style="padding:12px 0;font-weight:700">💰 Kupilo</td><td style="padding:12px 0;text-align:right;font-size:18px;font-weight:700;color:${(converted ?? 0) > 0 ? '#15803d' : '#0f172a'}">${converted ?? 0}</td></tr>
    </table>
    ${topHtml ? `
    <h3 style="font-size:13px;color:#374151;margin:20px 0 10px">Top kontakti ta teden (score ≥ 7):</h3>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="background:#f8fafc">
        <th style="padding:6px 12px;text-align:left">Podjetje</th>
        <th style="padding:6px 12px;text-align:left">Mesto</th>
        <th style="padding:6px 12px;text-align:center">Score</th>
        <th style="padding:6px 12px;text-align:left">Status</th>
        <th style="padding:6px 12px;text-align:left">Paket</th>
      </tr></thead>
      <tbody>${topHtml}</tbody>
    </table>` : '<p style="color:#94a3b8;font-size:13px">Ni novih kontaktov s score ≥ 7 ta teden.</p>'}
    <p style="margin:24px 0 0;font-size:11px;color:#94a3b8">
      Admin panel: <a href="https://carbonis.eu/admin/m8">carbonis.eu/admin/m8</a>
    </p>
  </div>
</div>
</body></html>`

  // Send via Brevo
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'M8 Agent', email: 'info@carbonis.eu' },
      to: [{ email: REPORT_TO }],
      subject: `M8 Report ${fmt(weekStart)}–${fmt(weekEnd)} | DA: ${repliedYes ?? 0} | Kupilo: ${converted ?? 0}`,
      htmlContent: reportHtml,
    }),
  })

  // Save to DB
  await db.from('weekly_reports').insert({
    week_start: weekStart.toISOString().split('T')[0],
    week_end: weekEnd.toISOString().split('T')[0],
    new_prospects_found: newProspects ?? 0,
    emails_sent: emailsSent ?? 0,
    emails_opened: emailsOpened ?? 0,
    replied_yes: repliedYes ?? 0,
    replied_no: repliedNo ?? 0,
    unsubscribed: unsubscribed ?? 0,
    converted: converted ?? 0,
    report_html: reportHtml,
    sent_to: REPORT_TO,
  })

  console.log('[m8-weekly] report sent')
  return NextResponse.json({ ok: true })
}
