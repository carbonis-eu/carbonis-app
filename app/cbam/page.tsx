import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '../components/landing/SiteHeader'
import { SiteFooter } from '../components/landing/SiteFooter'
import CbamCalculatorSection from './_components/CbamCalculatorSection'
import type { CbamSector } from '@/lib/cbam/data'

export const metadata: Metadata = {
  title: 'What is CBAM? Carbon Border Adjustment Mechanism Explained | Carbonis',
  description: 'CBAM (Carbon Border Adjustment Mechanism) applies from January 2026. Learn what it means for EU importers, which sectors are affected, timelines, and how to comply with Regulation (EU) 2023/956.',
  keywords: ['CBAM', 'Carbon Border Adjustment Mechanism', 'EU carbon compliance', 'CBAM certificates', 'carbon compliance software', 'CBAM 2026', 'EU importers carbon tax'],
  openGraph: {
    title: 'What is CBAM? Carbon Border Adjustment Mechanism Explained | Carbonis',
    description: 'CBAM applies from January 2026. Complete guide for EU importers — sectors, timelines, obligations and free cost calculator.',
    type: 'article',
  },
}

const SECTORS_PHOTOS: { key: CbamSector; name: string; codes: string; desc: string; img: string; accent: string }[] = [
  { key: 'steel', name: 'Iron & Steel', codes: 'CN 72, 73', desc: 'Crude steel, rolled products, pipes and tubes', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&h=500&fit=crop&auto=format&q=80', accent: '#1e3a5f' },
  { key: 'aluminum', name: 'Aluminium', codes: 'CN 76', desc: 'Primary aluminium, alloys and downstream products', img: 'https://images.unsplash.com/photo-1547555706-54bcf05bbad1?w=700&h=500&fit=crop&auto=format&q=80', accent: '#2d4a7a' },
  { key: 'cement', name: 'Cement', codes: 'CN 2507, 2523', desc: 'Clinker, Portland cement and construction materials', img: 'https://images.unsplash.com/photo-1666219462105-2909c2d72d01?w=700&h=500&fit=crop&auto=format&q=80', accent: '#374151' },
  { key: 'fertilizers', name: 'Fertilisers', codes: 'CN 2808, 2814, 31', desc: 'Nitric acid, ammonia and nitrogen-based fertilisers', img: 'https://images.unsplash.com/photo-1591630529805-63486bbce578?w=700&h=500&fit=crop&auto=format&q=80', accent: '#1a4731' },
  { key: 'hydrogen', name: 'Hydrogen', codes: 'CN 2804 10', desc: 'Pure hydrogen for industrial and energy applications', img: 'https://images.unsplash.com/photo-1759299983582-085079c31bdc?w=700&h=500&fit=crop&auto=format&q=80', accent: '#0c3547' },
  { key: 'electricity', name: 'Electricity', codes: 'CN 2716', desc: 'Electricity imported via cross-border interconnectors', img: 'https://images.unsplash.com/photo-1509391111737-9b07f052f6b6?w=700&h=500&fit=crop&auto=format&q=80', accent: '#1a2f5e' },
]

const STEPS = [
  { num: '01', title: 'Get authorised declarant status', body: 'Register in the EU CBAM Registry. Required for importers of covered goods from 1 Jan 2026 (Art. 2, Regulation (EU) 2023/956). Consult your national customs authority for your specific threshold.' },
  { num: '02', title: 'Collect embedded emissions data', body: 'Gather verified carbon data from your suppliers (actual values) or use EU Commission default values — Carbonis tracks both methods automatically.' },
  { num: '03', title: 'File your annual declaration', body: 'Submit your CBAM declaration by 31 May each year, covering all imports from the prior calendar year with verified emission data.' },
  { num: '04', title: 'Purchase & surrender certificates', body: 'Buy CBAM certificates at the EU ETS quarterly auction price (1 cert = 1 tCO₂e). Surrender the exact number corresponding to your declared emissions.' },
]

const DEADLINES = [
  { date: 'Oct 2023 – Dec 2025', label: 'Transitional period', desc: 'Reporting only, no financial obligation', done: true },
  { date: '1 Jan 2026', label: 'Definitive period begins', desc: 'Authorised declarant status required. Check EU CBAM Registry for applicable thresholds.', done: true },
  { date: '1 Feb – 30 Sep 2027', label: 'Certificate purchase window', desc: 'Buy and surrender CBAM certificates for 2026 imports', done: false },
  { date: '31 May 2027', label: 'First annual declaration due', desc: 'File CBAM declaration covering 2026 imports (Art. 6, Regulation (EU) 2023/956)', done: false },
  { date: 'Annually thereafter', label: 'Recurring obligation', desc: 'Declaration by 31 May, certificate surrender by 30 September each year', done: false },
]

export default function CbamPage() {
  return (
    <>
      <SiteHeader />
      <main>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 mb-6">
              Regulation (EU) 2023/956 &mdash; All 27 EU member states
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ letterSpacing: '-0.03em' }}>
              Carbon Border Adjustment<br />
              <span className="text-[#60a5fa]">Mechanism (CBAM)</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
              The EU&apos;s landmark climate policy placing a carbon price on imports — ensuring fair competition between EU and non-EU producers.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="#calculator" className="rounded-lg bg-cobalt px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1a4ce0] transition-colors">
                Calculate your liability ↓
              </a>
              <a href="#sectors" className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                See covered sectors ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── WHAT IS CBAM ── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">The basics</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                  What is CBAM and why does it matter?
                </h2>
                <p className="mt-5 text-base text-slate-600 leading-relaxed">
                  CBAM prevents <strong>carbon leakage</strong> — the risk that EU climate policies push carbon-intensive production to countries with weaker standards. Importers of covered goods must purchase <strong>CBAM certificates</strong> equal to the carbon price they would have paid under the EU ETS.
                </p>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  It applies across all <strong>27 EU member states</strong> to imports from any non-EU country, with deductions where equivalent carbon pricing already exists in the country of origin.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '27', label: 'EU member states covered', icon: '🇪🇺' },
                  { value: '6', label: 'Annex I sectors in scope', icon: '🏭' },
                  { value: 'Live*', label: 'Certificate price (EU CBAM Registry)', icon: '💶' },
                  { value: '2050', label: 'EU climate neutrality goal', icon: '🌱' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-slate-50 p-5">
                    <span className="text-2xl">{s.icon}</span>
                    <p className="mt-3 text-2xl font-extrabold text-navy">{s.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTORS ── */}
        <section id="sectors" className="scroll-mt-16 bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Annex I</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                Which goods are covered by CBAM?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                CBAM currently covers six carbon-intensive sectors. The scope is expected to expand in future EU amendments.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS_PHOTOS.map((s) => (
                <li key={s.name} className="group relative overflow-hidden rounded-2xl shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} width={700} height={500} loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${s.accent}f0 0%, ${s.accent}aa 40%, transparent 68%)` }} />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">{s.codes}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xl font-bold text-white">{s.name}</p>
                    <p className="mt-1 text-sm text-white/75">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── WHO MUST COMPLY ── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Obligations</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                Who is subject to CBAM?
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { role: 'Importers', icon: '📦', desc: 'Any EU-established company importing CBAM goods above the de minimis threshold. Consult your national customs authority for your specific obligations.' },
                { role: 'Indirect importers', icon: '🔗', desc: 'Companies whose products contain CBAM goods even if they do not import directly.' },
                { role: 'Customs representatives', icon: '📋', desc: 'Indirect representatives may fulfil CBAM obligations on behalf of the importer.' },
                { role: 'Enterprise groups', icon: '🏢', desc: 'Groups with subsidiaries across multiple EU member states must consolidate CBAM reporting.' },
              ].map((item) => (
                <div key={item.role} className="rounded-xl border border-border p-6 hover:border-cobalt hover:shadow-md transition-all">
                  <span className="text-3xl">{item.icon}</span>
                  <p className="mt-4 font-bold text-navy">{item.role}</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#60a5fa]">Process</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                How CBAM compliance works
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.num} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="font-mono text-3xl font-bold text-[#60a5fa]">{step.num}</span>
                  <p className="mt-4 font-semibold text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Key dates</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                CBAM timeline &amp; deadlines
              </h2>
            </div>
            <ol className="relative border-l-2 border-border ml-4">
              {DEADLINES.map((d) => (
                <li key={d.date} className="mb-8 ml-8">
                  <div className={`absolute -left-[9px] mt-1 size-4 rounded-full border-2 ${d.done ? 'border-cobalt bg-cobalt' : 'border-border bg-white'}`} />
                  <span className={`mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${d.done ? 'bg-cobalt/10 text-cobalt' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {d.date}
                  </span>
                  <h3 className="font-bold text-navy mt-1">{d.label}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{d.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CALCULATOR (client component) ── */}
        <CbamCalculatorSection />

        {/* ── CTA ── */}
        <section className="bg-cobalt py-16">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Ready to automate your CBAM compliance?
            </h2>
            <p className="mt-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Carbonis handles emissions data collection, declaration filing and certificate management — for all 6 sectors, across all 27 EU member states.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-cobalt shadow hover:bg-slate-100 transition-colors">
                Start free trial
              </Link>
              <Link href="/pricing" className="rounded-lg border px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
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
