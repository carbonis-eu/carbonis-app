export const instant = false
import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, company_name, role, tier, created_at')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Users</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>{users?.length ?? 0} total accounts</p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {['Email', 'Company', 'Role', 'Plan', 'Joined'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? users.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '12px 16px', color: '#0f172a' }}>{u.email}</td>
                <td style={{ padding: '12px 16px', color: '#475569' }}>{u.company_name ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: u.role === 'admin' ? '#fef3c7' : '#f1f5f9', color: u.role === 'admin' ? '#92400e' : '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                    {u.role ?? 'user'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>{u.tier ?? 'free'}</td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
