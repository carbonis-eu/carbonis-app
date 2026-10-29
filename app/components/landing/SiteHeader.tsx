import Link from 'next/link'

export function SiteHeader() {
  return (
    <header style={{ background: '#0B2471', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href="/" style={{ color: 'white', fontWeight: 700, fontSize: '18px', textDecoration: 'none' }}>
        carbonis.eu
      </Link>
      <Link href="/login" style={{ color: 'white', fontSize: '14px', textDecoration: 'none' }}>
        Login →
      </Link>
    </header>
  )
}
