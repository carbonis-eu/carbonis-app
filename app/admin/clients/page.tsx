export const instant = false
import { createClient } from '@/lib/supabase/server'

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('profiles')
    .select('id, email, company_name, country, role, tier, trial_ends_at, created_at')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Clients</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>{clients?.length ?? 0} registered companies</p>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {['Company', 'Email', 'Country', 'Tier', 'Status', 'Joined'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients && clients.length > 0 ? clients.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < clients.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{c.company_name ?? '—'}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>{c.email}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>{c.country ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: c.tier === 'free' ? '#f1f5f9' : '#eff6ff', color: c.tier === 'free' ? '#64748b' : '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                    {c.tier ?? 'free'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Active</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>
                  {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No clients yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
