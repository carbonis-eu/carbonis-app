import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from '@/app/admin/_components/AdminSidebar'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface VeraLog {
  id: string
  created_at: string
  what_went_well: string | null
  what_to_improve: string | null
  overall_rating: number | null
  analysis_text: string | null
  industry: string | null
  contacts_estimate: string | null
  lead_id: string | null
}

const RATING_COLOR: Record<number, string> = {
  5: '#16a34a', 4: '#65a30d', 3: '#d97706', 2: '#dc2626', 1: '#991b1b',
}

async function getAdminInfo() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email ?? 'admin'
  const initials = email.substring(0, 2).toUpperCase()
  return { email, initials }
}

export default async function VeraAnalizaPage() {
  const db = createAdminClient()
  const { data: logs } = await db
    .from('vera_session_logs')
    .select('id, created_at, what_went_well, what_to_improve, overall_rating, analysis_text, industry, contacts_estimate, lead_id')
    .order('created_at', { ascending: false })
    .limit(50)

  const { email, initials } = await getAdminInfo()

  const avgRating = logs && logs.length > 0
    ? (logs.reduce((s, l) => s + (l.overall_rating ?? 0), 0) / logs.length).toFixed(1)
    : '—'

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#F7F8FA' }}>
      <AdminSidebar adminEmail={email} adminInitials={initials} />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Vera — samoanaliza</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Vera analizira vsak zaključen pogovor in se uči za naslednjič.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Skupaj analiz', value: logs?.length ?? 0 },
              { label: 'Povprečna ocena', value: `${avgRating} / 5` },
              { label: 'Z lead-om', value: logs?.filter(l => l.lead_id).length ?? 0 },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: '1 1 180px' }}>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ color: '#0f172a', fontSize: '22px', fontWeight: 700, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          {!logs || logs.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
              Ni še analiz. Ko Vera zbere lead in zaključi pogovor, se analiza samodejno ustvari.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(logs as VeraLog[]).map(log => (
                <div key={log.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {log.industry && (
                          <span style={{ background: '#eff6ff', color: '#1e40af', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>{log.industry}</span>
                        )}
                        {log.contacts_estimate && (
                          <span style={{ background: '#f0fdf4', color: '#166534', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>{log.contacts_estimate}</span>
                        )}
                        {log.lead_id && (
                          <span style={{ background: '#fefce8', color: '#854d0e', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>✓ lead</span>
                        )}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '6px 0 0' }}>
                        {new Date(log.created_at).toLocaleString('sl-SI')}
                      </p>
                    </div>
                    {log.overall_rating && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: RATING_COLOR[log.overall_rating] ?? '#94a3b8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 800, fontSize: '18px',
                        }}>{log.overall_rating}</div>
                        <p style={{ fontSize: '10px', color: '#94a3b8', margin: '4px 0 0' }}>/ 5</p>
                      </div>
                    )}
                  </div>

                  {log.what_went_well && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>+</span>
                      <p style={{ color: '#0f172a', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{log.what_went_well}</p>
                    </div>
                  )}
                  {log.what_to_improve && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>−</span>
                      <p style={{ color: '#0f172a', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{log.what_to_improve}</p>
                    </div>
                  )}
                  {log.analysis_text && (
                    <p style={{ color: '#64748b', fontSize: '12px', margin: '10px 0 0', lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>{log.analysis_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
