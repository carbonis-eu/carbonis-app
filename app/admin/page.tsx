export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function KpiCard({ label, value, sub, color = '#265CFF' }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
      <p style={{ color: '#0f172a', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>{value}</p>
      <p style={{ color, fontSize: '11px' }}>{sub}</p>
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = user?.email ?? 'admin'

  const db = createAdminClient()

  const [
    { count: totalProspects },
    { count: scoredProspects },
    { count: emailSent },
    { count: repliedYes },
    { count: lost },
    { data: recentProspects },
    { data: lastReport },
  ] = await Promise.all([
    db.from('prospects').select('id', { count: 'exact', head: true }),
    db.from('prospects').select('id', { count: 'exact', head: true }).eq('status', 'scored'),
    db.from('prospects').select('id', { count: 'exact', head: true }).in('status', ['email_sent', 'replied_yes', 'replied_no']),
    db.from('prospects').select('id', { count: 'exact', head: true }).eq('status', 'replied_yes'),
    db.from('prospects').select('id', { count: 'exact', head: true }).eq('status', 'lost'),
    db.from('prospects').select('company_name, city, industry, lead_score, status, last_action_at').order('created_at', { ascending: false }).limit(8),
    db.from('weekly_reports').select('week_start, week_end, prospects_found, emails_sent, replies_yes, report_html').order('created_at', { ascending: false }).limit(1),
  ])

  const report = lastReport?.[0]
  const conversionRate = emailSent && emailSent > 0
    ? ((repliedYes ?? 0) / emailSent * 100).toFixed(1)
    : '0'

  const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    new:          { label: 'Nov',          color: '#64748b', bg: '#f1f5f9' },
    scored:       { label: 'Ocenjen',      color: '#d97706', bg: '#fef3c7' },
    email_sent:   { label: 'Email poslan', color: '#2563eb', bg: '#dbeafe' },
    replied_yes:  { label: 'Odgovoril DA', color: '#16a34a', bg: '#dcfce7' },
    replied_no:   { label: 'Odgovoril NE', color: '#dc2626', bg: '#fee2e2' },
    lost:         { label: 'Izgubljen',    color: '#94a3b8', bg: '#f1f5f9' },
    unsubscribed: { label: 'Odjavljen',    color: '#94a3b8', bg: '#f1f5f9' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>M8 Pregled</h1>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b' }}>{adminEmail}</span>
      </header>

      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          <KpiCard label="Skupaj prospects" value={String(totalProspects ?? 0)} sub="v bazi" />
          <KpiCard label="Emaili poslani" value={String(emailSent ?? 0)} sub="skupaj do danes" />
          <KpiCard label="Odgovorili DA" value={String(repliedYes ?? 0)} sub={`${conversionRate}% konverzija`} color="#16a34a" />
          <KpiCard label="Izgubljeni" value={String(lost ?? 0)} sub="brez odgovora" color="#dc2626" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>

          {/* Zadnji prospects */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Zadnji prospects</h3>
              <a href="/admin/prospects" style={{ fontSize: '12px', color: '#265CFF', textDecoration: 'none', fontWeight: 500 }}>Vsi →</a>
            </div>
            {!recentProspects?.length ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Ni podatkov — cron še ni tekel</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Podjetje', 'Mesto', 'Ocena', 'Status'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentProspects.map((p, i) => {
                    const st = STATUS_LABELS[p.status ?? 'new'] ?? STATUS_LABELS['new']
                    return (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{p.company_name}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: '#64748b' }}>{p.city ?? '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontWeight: 700, color: (p.lead_score ?? 0) >= 7 ? '#16a34a' : (p.lead_score ?? 0) >= 5 ? '#d97706' : '#94a3b8' }}>
                            {p.lead_score ?? '—'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>{st.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Zadnje poročilo + pipeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Pipeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Novi', value: (totalProspects ?? 0) - (scoredProspects ?? 0) - (emailSent ?? 0) - (repliedYes ?? 0) - (lost ?? 0), color: '#64748b' },
                  { label: 'Ocenjeni', value: scoredProspects ?? 0, color: '#d97706' },
                  { label: 'Emaili poslani', value: emailSent ?? 0, color: '#2563eb' },
                  { label: 'Odgovorili DA', value: repliedYes ?? 0, color: '#16a34a' },
                  { label: 'Izgubljeni', value: lost ?? 0, color: '#dc2626' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '13px', color: '#334155' }}>{row.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: row.color }}>{Math.max(0, row.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {report && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Zadnje tedensko poročilo</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                  {report.week_start ? new Date(report.week_start).toLocaleDateString('sl-SI') : ''} — {report.week_end ? new Date(report.week_end).toLocaleDateString('sl-SI') : ''}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Najdeni', value: report.prospects_found ?? 0 },
                    { label: 'Emaili', value: report.emails_sent ?? 0 },
                    { label: 'DA', value: report.replies_yes ?? 0 },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <a href="/admin/porocila" style={{ display: 'block', marginTop: '12px', fontSize: '12px', color: '#265CFF', textDecoration: 'none', fontWeight: 500 }}>Vsa poročila →</a>
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  )
}
