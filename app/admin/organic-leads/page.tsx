export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: 'Nov',        color: '#64748b', bg: '#f1f5f9' },
  contacted: { label: 'Kontaktiran', color: '#2563eb', bg: '#dbeafe' },
  converted: { label: 'Konvertiran', color: '#16a34a', bg: '#dcfce7' },
  lost:      { label: 'Izgubljen',  color: '#dc2626', bg: '#fee2e2' },
}

const INDUSTRY_LABELS: Record<string, string> = {
  avtoservis:   'Avtoservis',
  kozmetika:    'Kozmetika',
  fitnes:       'Fitnes',
  gostinstvo:   'Gostinstvo',
  nepremicnine: 'Nepremičnine',
  ordinacije:   'Ordinacija',
  drugo:        'Drugo',
}

export default async function OrganicLeadsPage() {
  const db = createAdminClient()

  const { data: leads } = await db
    .from('organic_leads')
    .select('id, created_at, contact_name, company_name, email, industry, estimated_contacts, recommended_package, estimated_roi_eur, status, gdpr_consent')
    .order('created_at', { ascending: false })
    .limit(300)

  const list = leads ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <header style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '0 24px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
          Organic Leads — Vera{' '}
          <span style={{ color: '#94a3b8', fontWeight: 400 }}>({list.length})</span>
        </h1>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b' }}>
          <span>Novi: <b style={{ color: '#265CFF' }}>{list.filter(l => l.status === 'new').length}</b></span>
          <span>·</span>
          <span>Konvertirani: <b style={{ color: '#16a34a' }}>{list.filter(l => l.status === 'converted').length}</b></span>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {list.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Ni organic leads</p>
            <p style={{ fontSize: '13px' }}>Leadi se bodo pojavili ko bodo stranke končale pogovor z Vero.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Ime', 'Podjetje', 'Email', 'Panoga', 'Baza', 'Paket', 'ROI €/mes', 'Status', 'GDPR', 'Čas'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 600, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((l, i) => {
                const st = STATUS_LABELS[l.status ?? 'new'] ?? STATUS_LABELS['new']
                return (
                  <tr key={l.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: '#0f172a' }}>{l.contact_name}</td>
                    <td style={{ padding: '10px 14px', color: '#0f172a', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.company_name}</td>
                    <td style={{ padding: '10px 14px', color: '#265CFF' }}>
                      <a href={`mailto:${l.email}`} style={{ color: '#265CFF', textDecoration: 'none' }}>{l.email}</a>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{INDUSTRY_LABELS[l.industry ?? ''] ?? l.industry ?? '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{l.estimated_contacts ?? '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b', textTransform: 'capitalize' }}>{l.recommended_package ?? '—'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0B2471' }}>
                      {l.estimated_roi_eur ? `${Number(l.estimated_roi_eur).toLocaleString('sl-SI')} €` : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        background: st.bg, color: st.color,
                        fontSize: '11px', fontWeight: 600,
                        padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap',
                      }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: l.gdpr_consent ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                      {l.gdpr_consent ? '✓' : '✗'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {l.created_at ? new Date(l.created_at).toLocaleString('sl-SI', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
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
