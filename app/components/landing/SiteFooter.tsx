import Link from 'next/link'
import Image from 'next/image'

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'CBAM compliance', href: '#platform' },
      { label: 'CBAM calculator', href: '#calculator' },
      { label: 'Sector coverage', href: '#sectors' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Regulation timeline', href: '#regulation' },
      { label: 'FAQ', href: '#faq' },
      { label: 'CBAM tool', href: '/cbam' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact sales', href: 'mailto:sales@carbonis.eu' },
      { label: 'Log in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[2fr_3fr] lg:px-8">
        <div>
          <Image src="/carbonis-logo-tagline.png" alt="Carbonis" width={200} height={60} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The EU carbon compliance platform for importers and manufacturers.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-navy">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-cobalt">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Carbonis. All rights reserved.</p>
          <p>Indicative calculations only. Not legal or tax advice.</p>
        </div>
      </div>
    </footer>
  )
}
