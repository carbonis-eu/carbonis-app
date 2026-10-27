'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const NAV = [
  { label: 'Dashboard',    href: '/dashboard',              icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { label: 'Emissions',    href: '/dashboard/emissions',    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 14l4-5 3 3 3-4 4-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: 'Supply Chain', href: '/dashboard/supply-chain', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="4" r="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="12" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7.5L11 4.5M5 8.5L11 11.5" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: 'Regulations',  href: '/dashboard/regulations',  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: 'Reports',      href: '/dashboard/reports',      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 8l2 2 5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { label: 'Documents',    href: '/dashboard/documents',    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { label: 'Settings',     href: '/dashboard/settings',     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.3 3.3l1 1M11.7 11.7l1 1M3.3 12.7l1-1M11.7 4.3l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
]

interface Props {
  companyName: string
  initials: string
  tier: string
  isTrial: boolean
  trialDaysLeft: number
}

export default function DashboardSidebar({ companyName, initials, tier, isTrial, trialDaysLeft }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{ width: '220px', background: '#0B2471', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="24" height="24" viewBox="0 0 56 56" fill="none" aria-hidden="true">
          <defs><linearGradient id="ds-g" x1="10" y1="8" x2="46" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#60A5FA"/><stop offset="50%" stopColor="#265CFF"/><stop offset="100%" stopColor="#93c5fd"/></linearGradient></defs>
          <path d="M 37.5,44.5 A 19,19 0 1,1 44.5,18.5" stroke="url(#ds-g)" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <circle cx="37.5" cy="44.5" r="4.2" fill="url(#ds-g)"/><circle cx="11.5" cy="37.5" r="4.2" fill="url(#ds-g)"/><circle cx="18.5" cy="11.5" r="4.2" fill="url(#ds-g)"/><circle cx="44.5" cy="18.5" r="4.2" fill="url(#ds-g)"/>
        </svg>
        <span style={{ color: 'white', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>Carbonis</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 0', overflow: 'auto' }}>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 16px', fontSize: '13px', textDecoration: 'none',
              color: active ? 'white' : 'rgba(255,255,255,0.55)',
              background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: active ? '2px solid #60a5fa' : '2px solid transparent',
              fontWeight: active ? 600 : 400,
            }}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Trial badge */}
      {isTrial && (
        <div style={{ margin: '0 12px 8px', background: 'rgba(37,92,255,0.2)', border: '1px solid rgba(37,92,255,0.35)', borderRadius: '8px', padding: '10px 12px' }}>
          <p style={{ color: 'white', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}>Trial: {trialDaysLeft}d left</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Upgrade for full access</p>
        </div>
      )}

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #265CFF, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{companyName}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', textTransform: 'uppercase' }}>{tier}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 12H2a1 1 0 01-1-1V3a1 1 0 011-1h3M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}
