'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const NAV = [
  {
    label: 'Pregled',
    href: '/admin',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
  },
  {
    label: 'Prospects',
    href: '/admin/prospects',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Emaili',
    href: '/admin/emaili',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 3h14v9a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.4"/><path d="M1 3l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Poročila',
    href: '/admin/porocila',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 8l2 2 5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Stranke',
    href: '/admin/stranke',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Finance',
    href: '/admin/finance',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4v1.5M8 10.5V12M6 7.5C6 6.7 6.9 6 8 6s2 .7 2 1.5S9.1 9 8 9s-2 .7-2 1.5S6.9 11 8 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Vera Leads',
    href: '/admin/organic-leads',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8.5C13 11.54 10.87 14 8 14C6.85 14 5.76 13.62 4.82 12.95L2 14L2.78 11.18C2.28 10.24 2 9.15 2 8C2 4.96 4.69 2.5 8 2.5C11.31 2.5 14 4.96 14 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: 'Navi',
    href: '/admin/navi',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Nastavitve',
    href: '/admin/settings',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.3 3.3l1 1M11.7 11.7l1 1M3.3 12.7l1-1M11.7 4.3l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
]

interface Props {
  adminEmail?: string
  adminInitials?: string
}

export default function AdminSidebar({ adminEmail = 'admin', adminInitials = 'A' }: Props) {
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
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ color: 'white', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>carbonis.eu</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginTop: '2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin — M8 sistem</p>
      </div>

      <nav style={{ flex: 1, padding: '10px 0', overflow: 'auto' }}>
        {NAV.map(item => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
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

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #265CFF, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{adminInitials}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminEmail}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px' }}>Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 12H2a1 1 0 01-1-1V3a1 1 0 011-1h3M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Odjava
        </button>
      </div>
    </aside>
  )
}
