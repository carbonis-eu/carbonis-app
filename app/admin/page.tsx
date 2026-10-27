export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const InfoIcon = ({ text }: { text: string }) => (
  <div title={text} style={{ position: 'relative', display: 'inline-flex', cursor: 'help' }}>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: '#94a3b8' }}>
      <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 6.5v4M7.5 5v-.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  </div>
)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = user?.email ?? 'admin'
  const adminInitials = adminEmail.slice(0, 2).toUpperCase()

  const { data: clients, count: clientCount } = await supabase
    .from('profiles')
    .select('id, company_name, tier, created_at', { count: 'exact' })
    .neq('role', 'admin')
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: userCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .neq('role', 'admin')

  const totalClients = clientCount ?? 0
  const totalUsers = userCount ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.3"/><path d="M9.5 9.5L12 12" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search clients, users..." style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', height: '34px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#334155', background: '#f8fafc', outline: 'none' }} readOnly />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #265CFF, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>{adminInitials}</div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{adminEmail}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>Admin Overview</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Platform health, client management and compliance monitoring.</p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Registered clients', value: String(totalClients), sub: totalClients === 0 ? 'No clients yet' : `${totalClients} total`, color: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="#265CFF" strokeWidth="1.4"/><path d="M2.5 16.5c0-3.9 3-7 6.5-7s6.5 3.1 6.5 7" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>, info: 'Companies registered on Carbonis (from profiles table)' },
            { label: 'Total users', value: String(totalUsers), sub: totalUsers === 0 ? 'No users yet' : `${totalUsers} total`, color: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6" cy="6" r="3" stroke="#265CFF" strokeWidth="1.4"/><circle cx="12" cy="6" r="3" stroke="#265CFF" strokeWidth="1.4"/><path d="M1 16c0-3 2-5 5-5M10 11c3 0 7 1.8 7 5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>, info: 'All registered users excluding admins' },
            { label: 'CBAM declarations', value: '—', sub: 'Coming soon', color: '#94a3b8', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="1.5" stroke="#265CFF" strokeWidth="1.4"/><path d="M6 7h6M6 10h6M6 13h3" stroke="#265CFF" strokeWidth="1.3" strokeLinecap="round"/></svg>, info: 'CBAM declarations submitted via the platform (feature in development)' },
            { label: 'Pending actions', value: '0', sub: 'All clear', color: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#265CFF" strokeWidth="1.4"/><path d="M9 6v4M9 12v.5" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/></svg>, info: 'Items requiring admin attention' },
          ].map(k => (
            <div key={k.label} style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>{k.label}</p>
                  <InfoIcon text={k.info} />
                </div>
                <div style={{ width: '34px', height: '34px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{k.icon}</div>
              </div>
              <p style={{ color: '#0f172a', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>{k.value}</p>
              <p style={{ color: k.color, fontSize: '11px' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>

          {/* Clients table */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Clients</h3>
                <InfoIcon text="Companies that have registered on Carbonis. Manage in Clients section." />
              </div>
              <Link href="/admin/clients" style={{ fontSize: '12px', color: '#265CFF', fontWeight: 500, textDecoration: 'none' }}>View all →</Link>
            </div>
            {(!clients || clients.length === 0) ? (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}><circle cx="20" cy="14" r="8" stroke="#cbd5e1" strokeWidth="2"/><path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/></svg>
                <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>No clients yet</p>
                <p style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '4px' }}>Clients will appear here once they register on Carbonis.</p>
              </div>
            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Company', 'Plan', 'Registered'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c, i) => (
                      <tr key={c.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{c.company_name ?? '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                          <span style={{ background: c.tier === 'free' ? '#f1f5f9' : '#EEF2FF', color: c.tier === 'free' ? '#64748b' : '#265CFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '11px', textTransform: 'capitalize' }}>{c.tier ?? 'free'}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalClients > 5 && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Showing 5 of {totalClients}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Quick links */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Quick access</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/admin/clients', label: 'Manage clients', desc: 'View and manage registered companies' },
                  { href: '/admin/users', label: 'Manage users', desc: 'User accounts and permissions' },
                  { href: '/admin/regulations', label: 'Regulations', desc: 'CBAM regulatory updates' },
                  { href: '/admin/reports', label: 'Reports', desc: 'Compliance reports overview' },
                  { href: '/admin/system', label: 'System', desc: 'Platform health and logs' },
                  { href: '/admin/settings', label: 'Settings', desc: 'Admin configuration' },
                ].map(l => (
                  <Link key={l.href} href={l.href} style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', border: '1px solid #f1f5f9', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s', background: '#fafafa' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{l.label}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{l.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
