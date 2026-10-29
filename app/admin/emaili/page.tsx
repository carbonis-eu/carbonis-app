export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'

const TYPE_LABELS: Record<string, string> = {
  initial: 'Uvodni',
  followup_1: 'Followup 1',
  followup_2: 'Followup 2',
  followup_3: 'Followup 3 (zadnji)',
  demo_link: 'Demo link',
  final_attempt: 'Ponovni poskus (90d)',
}

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  sent:      { color: '#64748b', bg: '#f1f5f9' },
  delivered: { color: '#2563eb', bg: '#dbeafe' },
  opened:    { color: '#d97706', bg: '#fef3c7' },
  clicked:   { color: '#7c3aed', bg: '#ede9fe' },
  replied:   { color: '#16a34a', bg: '#dcfce7' },
  bounced:   { color: '#dc2626', bg: '#fee2e2' },
}

export default async function EmailiPage() {
  const db = createAdminClient()

  const { data: logs } = await db
    .from('email_logs')
    .select('id, email_type, status, sent_at, opened_at, clicked_at, replied_at, subject, prospects(company_name, email, city)')
    .order('sent_at', { ascending: false })
    .limit(200)

  const list = logs ?? []

  const totalSent = list.length
  const totalOpened = list.filter(l => l.status === 'opened' || l.status === 'clicked' || l.status === 'replied').length
  const totalReplied = list.filter(l => l.status === 'replied').length
  const openRate = totalSent > 0 ? (totalOpened / totalSent * 100).toFixed(1) : '0'
  const replyRate = totalSent > 0 ? (totalReplied / totalSent * 100).toFixed(1) : '0'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Emaili <span style={{ color: '#94a3b8', fontWeight: 400 }}>({totalSent})</span></h1>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <span>Odprti: <b style={{ color: '#d97706' }}>{openRate}%</b></span>
          <span>Odgovori: <b style={{ color: '#16a34a' }}>{replyRate}%</b></span>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {list.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Ni poslanih emailov</p>
            <p style={{ fontSize: '13px' }}>Emaili se bodo prikazali, ko bo cron poslal prve sporočila.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Podjetje', 'Email', 'Tip', 'Zadeva', 'Status', 'Poslano', 'Odprt', 'Odgovor'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((l, i) => {
                const st = STATUS_STYLES[l.status ?? 'sent'] ?? STATUS_STYLES['sent']
                const prospect = Array.isArray(l.prospects) ? l.prospects[0] : l.prospects
                return (
                  <tr key={l.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: '#0f172a', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prospect?.company_name ?? '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prospect?.email ?? '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {TYPE_LABELS[l.email_type ?? ''] ?? l.email_type ?? '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#334155', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.subject ?? '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>{l.status ?? '—'}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {l.sent_at ? new Date(l.sent_at).toLocaleDateString('sl-SI') : '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>
                      {l.opened_at ? '✓' : '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: l.replied_at ? '#16a34a' : '#94a3b8', fontSize: '12px' }}>
                      {l.replied_at ? '✓ ' + new Date(l.replied_at).toLocaleDateString('sl-SI') : '—'}
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
