export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import EmailPreviewButton from './_components/EmailPreviewButton'

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new:          { label: 'Nov',          color: '#64748b', bg: '#f1f5f9' },
  scored:       { label: 'Ocenjen',      color: '#d97706', bg: '#fef3c7' },
  email_sent:   { label: 'Email poslan', color: '#2563eb', bg: '#dbeafe' },
  replied_yes:  { label: 'Odgovoril DA', color: '#16a34a', bg: '#dcfce7' },
  replied_no:   { label: 'Odgovoril NE', color: '#dc2626', bg: '#fee2e2' },
  lost:         { label: 'Izgubljen',    color: '#94a3b8', bg: '#f1f5f9' },
  unsubscribed: { label: 'Odjavljen',    color: '#94a3b8', bg: '#f8f8f8' },
}

const INDUSTRY_LABELS: Record<string, string> = {
  avtoservis: 'Avtoservis',
  kozmetika: 'Kozmetika',
  fitnes: 'Fitnes',
  gostinstvo: 'Gostinstvo',
  nepremicnine: 'Nepremičnine',
  ordinacija: 'Ordinacija',
}

export default async function ProspectsPage() {
  const db = createAdminClient()

  const { data: prospects } = await db
    .from('prospects')
    .select('id, company_name, city, industry, lead_score, status, email, phone, google_rating, google_reviews_count, recommended_package, last_action_at, created_at')
    .order('lead_score', { ascending: false })
    .limit(200)

  const list = prospects ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Prospects <span style={{ color: '#94a3b8', fontWeight: 400 }}>({list.length})</span></h1>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
          <span>Score ≥7: <b style={{ color: '#16a34a' }}>{list.filter(p => (p.lead_score ?? 0) >= 7).length}</b></span>
          <span>·</span>
          <span>Brez emaila: <b style={{ color: '#dc2626' }}>{list.filter(p => !p.email).length}</b></span>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {list.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Ni prospects</p>
            <p style={{ fontSize: '13px' }}>Cron bo dodal prve prospects ob 08:00.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Podjetje', 'Mesto', 'Branža', 'Ocena', 'Rating', 'Email', 'Paket', 'Status', 'Zadnja akcija', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => {
                const st = STATUS_LABELS[p.status ?? 'new'] ?? STATUS_LABELS['new']
                const scoreColor = (p.lead_score ?? 0) >= 7 ? '#16a34a' : (p.lead_score ?? 0) >= 5 ? '#d97706' : '#94a3b8'
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: '#0f172a', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.company_name}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{p.city ?? '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{INDUSTRY_LABELS[p.industry ?? ''] ?? p.industry ?? '—'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: scoreColor }}>{p.lead_score ?? '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>
                      {p.google_rating ? `${p.google_rating} ★ (${p.google_reviews_count ?? 0})` : '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: p.email ? '#16a34a' : '#dc2626' }}>
                      {p.email ? '✓' : '✗'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b', textTransform: 'capitalize' }}>{p.recommended_package ?? '—'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>
                      {p.last_action_at ? new Date(p.last_action_at).toLocaleDateString('sl-SI') : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <EmailPreviewButton prospectId={p.id} hasEmail={!!p.email} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
