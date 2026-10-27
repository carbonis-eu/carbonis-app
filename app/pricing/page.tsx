import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingCards } from './_components/PricingCards'
import { SiteHeader } from '../components/landing/SiteHeader'
import { SiteFooter } from '../components/landing/SiteFooter'

export const metadata: Metadata = {
  title: 'Pricing — Carbonis EU CBAM Compliance Platform',
  description: 'Simple, transparent pricing for EU CBAM compliance. Free for certificate sellers. From 79€/month for importers. 30-day free trial, no credit card required.',
  openGraph: {
    title: 'Carbonis Pricing — CBAM Compliance from 79€/month',
    description: 'Start free. Upgrade when ready. Cancel anytime.',
    url: 'https://carbonis.eu/pricing',
  },
}

const FAQ = [
  {
    q: 'What happens after my 30-day trial?',
    a: 'You choose a plan or stay on the free Seller tier. No automatic charges. No credit card required to start.',
  },
  {
    q: 'Which sectors and CN codes are covered?',
    a: 'All six CBAM Annex I sectors: steel, aluminium, cement, fertilisers, hydrogen, and electricity — covering all applicable Combined Nomenclature (CN) codes under Regulation (EU) 2023/956.',
  },
  {
    q: 'What does the OTC bulletin board do?',
    a: 'PRO Trading subscribers can post and browse CBAM certificate offers from verified EU counterparties. When a match occurs, Carbonis generates an EFET-based contract template. Buyer and seller settle directly — Carbonis is not a party to the transaction.',
  },
  {
    q: 'Is Carbonis a financial intermediary or broker?',
    a: 'No. Carbonis operates as a bulletin board and compliance tool. We do not hold funds, certificates, or act as a counterparty. This structure is designed to remain outside MiFID II scope for CBAM and GO instruments.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes. Upgrade or downgrade at any time. Annual plans are non-refundable but can be credited toward an upgrade.',
  },
  {
    q: 'What is the Early Bird offer?',
    a: 'The first 10 companies to commit to an annual PRO Trading plan lock in 1,990 € per year — a 500 € saving versus the standard annual rate. This offer closes when the 10 founding spots are claimed.',
  },
]

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#F8FAFC]">

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pb-12 pt-20 text-center lg:px-8">
          <p className="mb-4 inline-block rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800">
            ⚡ Founding Member Offer — 10 spots remaining
          </p>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Get CBAM-ready before your first declaration is due.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Your first annual CBAM declaration covers all 2026 imports. Deadline: 31 May 2027.
            Missing it means penalties. Carbonis starts at <strong>79 €/month</strong>.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            30-day free trial · No credit card · Cancel anytime
          </p>
        </section>

        {/* Pricing cards with toggle */}
        <PricingCards />

        {/* Value reinforcement */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-navy">What you&apos;re actually buying</h2>
          <p className="mt-4 text-slate-600">
            Every EU importer of steel, aluminium, cement, fertilisers, hydrogen or electricity
            must file a CBAM annual declaration by 31 May 2027 — and purchase CBAM certificates
            to cover embedded emissions. Getting the data wrong, or filing late, exposes your
            company to regulatory risk. Carbonis gives you the tools to do it right the first time.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { label: 'Sectors covered', value: 'All 6 Annex I' },
              { label: 'Trial period', value: '30 days free' },
              { label: 'First declaration', value: '31 May 2027' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white px-6 py-8">
                <p className="text-3xl font-extrabold text-cobalt">{s.value}</p>
                <p className="mt-2 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 pb-24 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-navy">Frequently asked questions</h2>
          <div className="flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="px-7 py-6">
                <p className="font-semibold text-navy">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Have a question not listed here?{' '}
            <Link href="/register" className="font-medium text-cobalt hover:underline">
              Start your free trial
            </Link>{' '}
            and reach out from inside the platform.
          </p>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
