export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'

export default async function PorocilaPage() {
  const db = createAdminClient()

  const { data: reports } = await db
    .from('weekly_reports')
    .select('id, week_start, week_end, prospects_found, emails_sent, replies_yes, sent_to, created_at, report_html')
    .order('created_at', { ascending: false })
    .limit(52)

  const list = reports ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Tedenska poročila</h1>
      </header>

      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        {list.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Ni poročil</p>
            <p style={{ fontSize: '13px' }}>Prvo poročilo bo poslano v ponedeljek ob 07:00.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {list.map(r => {
              const convRate = r.emails_sent > 0 ? ((r.replies_yes / r.emails_sent) * 100).toFixed(1) : '0'
              return (
                <div key={r.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                        {r.week_start ? new Date(r.week_start).toLocaleDateString('sl-SI') : '—'} — {r.week_end ? new Date(r.week_end).toLocaleDateString('sl-SI') : '—'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        Poslano: {r.created_at ? new Date(r.created_at).toLocaleString('sl-SI') : '—'} → {r.sent_to}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                      <div>
                        <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{r.prospects_found ?? 0}</p>
                        <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Najdeni</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb' }}>{r.emails_sent ?? 0}</p>
                        <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Emaili</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>{r.replies_yes ?? 0}</p>
                        <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>DA</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '20px', fontWeight: 800, color: '#7c3aed' }}>{convRate}%</p>
                        <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Konv.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
