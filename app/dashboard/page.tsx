export const instant = false

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function getFirstName(email: string): string {
  const local = email.split('@')[0]
  const part = local.split(/[._-]/)[0]
  return part.charAt(0).toUpperCase() + part.slice(1)
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { label: 'Emissions', href: '/dashboard/emissions', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 14l4-5 3 3 3-4 4-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: 'Supply Chain', href: '/dashboard/supply-chain', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="4" r="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="12" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7.5L11 4.5M5 8.5L11 11.5" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: 'Regulations', href: '/dashboard/regulations', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: 'Reports', href: '/dashboard/reports', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 8l2 2 5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { label: 'Documents', href: '/dashboard/documents', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { label: 'Settings', href: '/dashboard/settings', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.3 3.3l1 1M11.7 11.7l1 1M3.3 12.7l1-1M11.7 4.3l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, vat_number, role, tier, trial_ends_at')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') redirect('/admin')

  const firstName = getFirstName(user.email ?? 'there')
  const greeting = getGreeting()
  const companyName = profile?.company_name ?? 'Your Company'
  const tier = profile?.tier ?? 'free'
  const initials = firstName.slice(0, 2).toUpperCase()

  const isTrial = tier === 'free'
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 30

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', overflow: 'hidden', background: '#f1f5f9' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: '220px', background: '#0B2471', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 56 56" fill="none" aria-hidden="true">
            <defs><linearGradient id="dg" x1="10" y1="8" x2="46" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#60A5FA"/><stop offset="50%" stopColor="#265CFF"/><stop offset="100%" stopColor="#93c5fd"/></linearGradient></defs>
            <path d="M 37.5,44.5 A 19,19 0 1,1 44.5,18.5" stroke="url(#dg)" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            <circle cx="37.5" cy="44.5" r="4.2" fill="url(#dg)"/><circle cx="11.5" cy="37.5" r="4.2" fill="url(#dg)"/><circle cx="18.5" cy="11.5" r="4.2" fill="url(#dg)"/><circle cx="44.5" cy="18.5" r="4.2" fill="url(#dg)"/>
          </svg>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>Carbonis</span>
        </div>

        <nav style={{ flex: 1, padding: '10px 0', overflow: 'auto' }}>
          {SIDEBAR_ITEMS.map(item => {
            const active = item.href === '/dashboard'
            return (
              <Link key={item.label} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 16px', fontSize: '13px', textDecoration: 'none',
                color: active ? 'white' : 'rgba(255,255,255,0.5)',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderLeft: active ? '2px solid #60a5fa' : '2px solid transparent',
                fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}>
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C3.7 1 1 3.7 1 7s2.7 6 6 6 6-2.7 6-6" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Your carbon journey is on track.</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px', marginBottom: '10px' }}>
            <div style={{ width: '78%', height: '100%', background: '#4ade80', borderRadius: '2px' }}/>
          </div>
          <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{companyName}</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>Supervised company</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', color: '#334155', fontWeight: 500 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="#64748b" strokeWidth="1.3"/></svg>
              {companyName}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
            <span style={{ fontSize: '11px', color: '#64748b' }}>🇸🇮 Slovenia</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isTrial && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#92400e', fontWeight: 500 }}>
                Trial: {trialDaysLeft}d left
              </div>
            )}
            <button style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 015 5v3l1.5 2.5H1.5L3 9V6a5 5 0 015-5zM6.5 13.5a1.5 1.5 0 003 0" stroke="#64748b" strokeWidth="1.3"/></svg>
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#265CFF', border: '1.5px solid white' }}/>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #0B2471, #265CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>{initials}</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{firstName}</p>
                <p style={{ fontSize: '10px', color: '#64748b' }}>Compliance Manager</p>
              </div>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

          {/* Welcome hero */}
          <div style={{ background: 'linear-gradient(135deg, #0B2471 0%, #265CFF 100%)', borderRadius: '14px', padding: '28px 32px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '280px', opacity: 0.12 }}>
              <svg viewBox="0 0 280 130" width="280" height="130" style={{ position: 'absolute', right: 0 }}><circle cx="200" cy="65" r="120" fill="none" stroke="white" strokeWidth="1"/><circle cx="200" cy="65" r="80" fill="none" stroke="white" strokeWidth="1"/><circle cx="200" cy="65" r="40" fill="none" stroke="white" strokeWidth="1"/></svg>
            </div>
            <div style={{ position: 'relative' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '6px', letterSpacing: '-0.02em' }}>{greeting}, {firstName}.</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Here&apos;s your compliance overview for today.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 18px', minWidth: '160px', textAlign: 'center', position: 'relative' }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', marginBottom: '4px' }}>Compliance score</p>
              <p style={{ color: 'white', fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>92%</p>
              <p style={{ color: '#4ade80', fontSize: '11px', marginTop: '4px' }}>↑ On track</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Total emissions', value: '12,480 tCO₂e', change: '↑ 12% vs. last quarter', changeColor: '#ef4444', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 8l3.5 3.5 3-5 3.5 5.5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>, iconBg: '#EEF2FF' },
              { label: 'CBAM declarations', value: '8', change: '2 pending review', changeColor: '#f59e0b', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="#265CFF" strokeWidth="1.4"/><path d="M5 7h8M5 10h5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>, iconBg: '#EEF2FF' },
              { label: 'Compliance status', value: 'On track', change: 'All requirements met', changeColor: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#265CFF" strokeWidth="1.4"/><path d="M6 9l2 2 4-4" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>, iconBg: '#EEF2FF' },
            ].map(k => (
              <div key={k.label} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', background: k.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{k.icon}</div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{k.label}</p>
                  <p style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, marginBottom: '3px', letterSpacing: '-0.02em' }}>{k.value}</p>
                  <p style={{ color: k.changeColor, fontSize: '11px' }}>{k.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '20px' }}>

            {/* Emissions trend */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Emissions trend</h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>CO₂ equivalent, tonnes</p>
                </div>
                <select style={{ fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', color: '#334155', background: 'white' }}>
                  <option>2025</option>
                </select>
              </div>
              <svg viewBox="0 0 560 140" style={{ width: '100%' }}>
                {[0, 28, 56, 84, 112].map(y => (
                  <line key={y} x1="30" y1={y + 10} x2="560" y2={y + 10} stroke="#f1f5f9" strokeWidth="1"/>
                ))}
                <path d="M40 110 Q80 105 120 96 Q160 87 200 78 Q240 68 280 62 Q320 54 360 48 Q400 40 440 36 Q480 30 520 26" fill="none" stroke="#265CFF" strokeWidth="2"/>
                <path d="M40 110 Q80 105 120 96 Q160 87 200 78 Q240 68 280 62 Q320 54 360 48 Q400 40 440 36 Q480 30 520 26 L520 130 L40 130Z" fill="url(#dg)"/>
                <defs>
                  <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#265CFF" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#265CFF" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                  <text key={m} x={40 + i * 43} y="142" fill="#94a3b8" fontSize="9" textAnchor="middle">{m}</text>
                ))}
                {[110, 90, 70, 50, 30].map((y, i) => (
                  <text key={y} x="26" y={y + 13} fill="#94a3b8" fontSize="9" textAnchor="end">{(5 - i) * 3}k</text>
                ))}
              </svg>
            </div>

            {/* Emissions by scope donut */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Emissions by scope</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>2025 YTD</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg viewBox="0 0 140 140" width="140" height="140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#f1f5f9" strokeWidth="20"/>
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#0B2471" strokeWidth="20"
                    strokeDasharray="237.6 101.6" strokeDashoffset="0"/>
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#265CFF" strokeWidth="20"
                    strokeDasharray="61.1 278.1" strokeDashoffset="-237.6"/>
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#93c5fd" strokeWidth="20"
                    strokeDasharray="40.7 298.5" strokeDashoffset="-298.7"/>
                  <text x="70" y="66" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">12,480</text>
                  <text x="70" y="80" textAnchor="middle" fontSize="9" fill="#94a3b8">tCO₂e</text>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  {color:'#0B2471',label:'Scope 3 (Supply chain)',pct:'70%'},
                  {color:'#265CFF',label:'Scope 2 (Energy)',pct:'18%'},
                  {color:'#93c5fd',label:'Scope 1 (Direct)',pct:'12%'},
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
                    <span style={{ color: '#64748b', fontSize: '12px', flex: 1 }}>{s.label}</span>
                    <span style={{ color: '#334155', fontSize: '12px', fontWeight: 600 }}>{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Quick actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                {label:'Upload data',sub:'Import emissions data',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 15V5M7 9l4-4 4 4" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17h14" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/></svg>},
                {label:'Create report',sub:'Generate CBAM report',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="2" width="16" height="18" rx="2" stroke="#265CFF" strokeWidth="1.5"/><path d="M7 7h8M7 11h8M7 15h4" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>},
                {label:'Check regulations',sub:'EU regulatory updates',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#265CFF" strokeWidth="1.5"/><path d="M11 7v5l3 2" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/></svg>},
                {label:'Manage supply chain',sub:'Supplier carbon data',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="4" cy="11" r="2.5" stroke="#265CFF" strokeWidth="1.5"/><circle cx="18" cy="5" r="2.5" stroke="#265CFF" strokeWidth="1.5"/><circle cx="18" cy="17" r="2.5" stroke="#265CFF" strokeWidth="1.5"/><path d="M6.5 10L15.5 5.5M6.5 12L15.5 16.5" stroke="#265CFF" strokeWidth="1.3"/></svg>},
              ].map(a => (
                <button key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fafafa', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '40px', height: '40px', background: '#EEF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.icon}</div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{a.label}</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>{a.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
