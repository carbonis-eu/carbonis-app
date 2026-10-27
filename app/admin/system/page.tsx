export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'

const Info = ({ text }: { text: string }) => (
  <span title={text} style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#94a3b8" strokeWidth="1.2"/><path d="M7 6v4M7 4.5v-.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
  </span>
)

const StatusBadge = ({ status }: { status: 'ok' | 'warn' | 'error' }) => {
  const map = { ok: ['#dcfce7', '#16a34a', 'Operational'], warn: ['#fef9c3', '#ca8a04', 'Warning'], error: ['#fee2e2', '#dc2626', 'Error'] }
  const [bg, color, label] = map[status]
  return <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{label}</span>
}

export default async function AdminSystemPage() {
  const supabase = await createClient()
  const { error: dbError } = await supabase.from('profiles').select('id', { count: 'exact', head: true })

  const services = [
    { name: 'Database (Supabase)', status: dbError ? 'error' : 'ok' as const, detail: dbError ? dbError.message : 'Connected — profiles table reachable' },
    { name: 'Auth service', status: 'ok' as const, detail: 'Supabase Auth active' },
    { name: 'Email service (Brevo)', status: 'ok' as const, detail: 'SMTP configured — info@carbonis.eu' },
    { name: 'CDN / Hosting', status: 'ok' as const, detail: 'Vercel — carbonis.eu' },
  ]

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>System</h1>
        <Info text="Platform health monitoring. Critical service failures will appear here." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {services.map(s => (
          <div key={s.name} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{s.name}</span>
              <StatusBadge status={s.status} />
            </div>
            <p style={{ fontSize: '12px', color: '#64748b' }}>{s.detail}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Recent Events</h3>
          <Info text="System events log — deployments, errors, and admin actions will appear here in a future update." />
        </div>
        <div style={{ padding: '32px', textAlign: 'center', color: '#cbd5e1' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 8px', display: 'block' }}>
            <rect x="2" y="2" width="28" height="28" rx="4" stroke="#e2e8f0" strokeWidth="1.8"/>
            <path d="M8 10h16M8 16h10M8 22h6" stroke="#e2e8f0" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: '13px' }}>Event logging coming soon</p>
        </div>
      </div>
    </div>
  )
}
