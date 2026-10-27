export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { SiteHeader } from '../components/landing/SiteHeader'
import { SiteFooter } from '../components/landing/SiteFooter'
import { CalculatorSection } from '../components/landing/CalculatorSection'
import { Faq } from '../components/landing/Faq'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What is CBAM? EU Carbon Border Adjustment Mechanism Explained',
  description: 'CBAM (Carbon Border Adjustment Mechanism) is EU Regulation 2023/956. Learn who must comply, which goods are covered, deadlines, penalties, and how to calculate your CBAM cost.',
  keywords: ['CBAM', 'carbon border adjustment mechanism', 'EU 2023/956', 'CBAM compliance', 'CBAM calculator', 'CBAM declaration', 'CBAM penalty'],
}

async function getEtsPrice(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://carbonis.eu'}/api/ets-price`, { next: { revalidate: 3600 } })
    if (res.ok) { const d = await res.json(); return d.price ?? 65.4 }
  } catch { /* fallback */ }
  return 65.4
}

const SECTORS = [
  { name: 'Iron & Steel', cn: 'CN 72–73', icon: '🏗️' },
  { name: 'Aluminium', cn: 'CN 76', icon: '🔩' },
  { name: 'Cement', cn: 'CN 2523', icon: '🏛️' },
  { name: 'Fertilisers', cn: 'CN 28, 31', icon: '🌱' },
  { name: 'Hydrogen', cn: 'CN 2804', icon: '⚡' },
  { name: 'Electricity', cn: 'CN 2716', icon: '🔌' },
]

const TIMELINE = [
  { date: 'Oct 2023 – Dec 2025', phase: 'Transitional period', desc: 'Quarterly emissions reporting required. No certificate surrender.' },
  { date: 'Jan 2026', phase: 'Financial phase begins', desc: 'CBAM certificates must be purchased and surrendered annually.' },
  { date: 'May 2027', phase: 'First annual declaration', desc: 'Declaration for 2026 imports due 31 May 2027. Certificate surrender window: Feb–Sep 2027.' },
  { date: 'Ongoing', phase: 'Full enforcement', desc: 'Quarterly monitoring, annual declaration, mandatory authorisation as CBAM declarant.' },
]

const STEPS = [
  { n: '01', title: 'Register as CBAM declarant', desc: 'Apply through the EU CBAM Registry via your national authority. Required for all authorised CBAM declarants.' },
  { n: '02', title: 'Track embedded emissions', desc: 'Collect embedded carbon data from each supplier. Default values apply if supplier data is unavailable.' },
  { n: '03', title: 'Purchase CBAM certificates', desc: 'Buy CBAM certificates at the current EU ETS price, set weekly by the European Commission.' },
  { n: '04', title: 'File annual declaration', desc: 'Submit your CBAM declaration by 31 May each year. Carbonis generates the XML automatically.' },
  { n: '05', title: 'Surrender certificates', desc: 'Surrender the required number of certificates to the CBAM Registry. Unused certificates can be repurchased by the Commission.' },
]

export default async function CbamPage() {
  const etsPrice = await getEtsPrice()

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-white py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt">EU Regulation 2023/956</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              What is CBAM?<br />
              <span className="text-cobalt">Carbon Border Adjustment Mechanism</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
              CBAM is the EU&apos;s carbon border tax that puts a price on the embedded CO₂ in imports of selected goods. It entered financial enforcement in January 2026. Any EU importer of covered goods must purchase CBAM certificates or face penalties of up to €50 per tonne.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">
                Calculate my CBAM cost →
              </Link>
              <Link href="#calculator" className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-navy hover:bg-muted transition-colors">
                Free calculator ↓
              </Link>
            </div>
          </div>
        </section>

        {/* Sectors */}
        <section id="platform" className="scroll-mt-16 bg-muted py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy mb-4">Who must comply with CBAM?</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Any EU importer bringing in goods from these sectors must become an authorised CBAM declarant and surrender certificates annually.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS.map(s => (
                <div key={s.name} className="rounded-xl border border-border bg-white p-5">
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="font-semibold text-navy">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.cn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy mb-10">How CBAM compliance works — 5 steps</h2>
            <div className="flex flex-col gap-6">
              {STEPS.map(s => (
                <div key={s.n} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cobalt flex items-center justify-center text-white text-sm font-bold">{s.n}</div>
                  <div>
                    <p className="font-semibold text-navy">{s.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section id="regulation" className="scroll-mt-16 border-y border-border bg-muted py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy mb-10">CBAM timeline &amp; key dates</h2>
            <div className="flex flex-col gap-6">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-36 text-xs font-semibold text-cobalt">{t.date}</div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{t.phase}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Penalties */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy mb-6">CBAM penalties for non-compliance</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { penalty: 'Up to €50/tonne', label: 'For failure to surrender certificates', cls: 'bg-red-50 border-red-200' },
                { penalty: '3× certificate value', label: 'Maximum penalty for non-compliance', cls: 'bg-amber-50 border-amber-200' },
                { penalty: 'Customs delays', label: 'Possible border stops for non-declarants', cls: 'bg-orange-50 border-orange-200' },
              ].map(p => (
                <div key={p.label} className={`rounded-xl border p-6 ${p.cls}`}>
                  <p className="text-2xl font-extrabold text-navy">{p.penalty}</p>
                  <p className="text-sm text-muted-foreground mt-2">{p.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-xl border border-cobalt/20 bg-cobalt/5 p-6">
              <p className="text-sm font-semibold text-navy mb-2">Carbonis automates your CBAM calculations</p>
              <p className="text-sm text-muted-foreground mb-4">PRO Compliance starts at 79 €/month — far less than any CBAM penalty.</p>
              <Link href="/register" className="inline-flex items-center rounded-lg bg-cobalt px-5 py-2.5 text-sm font-semibold text-white hover:bg-cobalt/90 transition-colors">
                Start free — calculate my CBAM →
              </Link>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <CalculatorSection etsPrice={etsPrice} />

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16">
          <Faq />
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-navy py-16">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-cobalt mb-3">Founding Member offer · 10 spots only</p>
            <h2 className="text-3xl font-bold text-white mb-4">Get CBAM-ready today</h2>
            <p className="text-muted-foreground mb-8">First 10 companies lock in PRO Trading at 1,990 €/year forever. Free 30-day trial, no credit card.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="rounded-lg bg-white px-8 py-3 text-sm font-bold text-navy hover:bg-muted transition-colors">
                Start free trial →
              </Link>
              <Link href="/pricing" className="rounded-lg border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
