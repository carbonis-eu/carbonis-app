'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'CBAM compliance', href: '/#platform' },
      { label: 'CBAM calculator', href: '/#calculator' },
      { label: 'Sector coverage', href: '/#sectors' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Regulation timeline', href: '/#regulation' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'What is CBAM?', href: '/cbam' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Log in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
]

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  if (status === 'ok') return <p className="text-sm text-cobalt font-semibold">✓ Prijavljeni ste na CBAM obvestila.</p>

  return (
    <form onSubmit={submit} className="mt-4 flex gap-2 max-w-xs">
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="email@podjetje.com"
        className="flex-1 rounded-md border border-border px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-cobalt/30"
        required
      />
      <button type="submit" disabled={status === 'sending'}
        className="rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-deep transition-colors disabled:opacity-60">
        {status === 'sending' ? '…' : 'OK'}
      </button>
    </form>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[2fr_3fr] lg:px-8">
        <div>
          <Image src="/carbonis-logo-tagline.png" alt="Carbonis" width={200} height={60} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The EU carbon compliance platform for importers and manufacturers.
          </p>
          <p className="mt-6 text-xs font-semibold text-navy uppercase tracking-wider">CBAM & ETS updates</p>
          <p className="text-xs text-muted-foreground mt-1">Get regulatory alerts and platform news.</p>
          <NewsletterForm />
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
