'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'seller',
    name: 'Seller',
    tagline: 'List your surplus certificates for free.',
    monthly: 0,
    annual: 0,
    earlyBird: null,
    highlight: false,
    cta: 'Create free account',
    ctaHref: '/register',
    features: [
      'VAT/VIES-verified company listing',
      'Publish CBAM & GO surplus certificates',
      'Automatic view counter',
      'Inquiry alerts by email',
      'EFET contract template on match',
      'No subscription. No commitment.',
    ],
  },
  {
    id: 'compliance',
    name: 'PRO Compliance',
    tagline: 'Everything you need to file your CBAM declaration.',
    monthly: 79,
    annual: 790,
    earlyBird: null,
    highlight: false,
    cta: 'Start 30-day free trial',
    ctaHref: '/register',
    features: [
      'Everything in Seller',
      'CBAM & ETS calculator — all Annex I sectors',
      'Compliance dashboard',
      'XML & PDF export (EU CBAM format)',
      'AI cost forecast for upcoming declarations',
      'Supplier data request tools',
      'Regulatory change alerts',
      'Email support',
    ],
  },
  {
    id: 'trading',
    name: 'PRO Trading',
    tagline: 'Compliance + the only EU OTC marketplace for CBAM & GO.',
    monthly: 249,
    annual: 2490,
    earlyBird: 1990,
    highlight: true,
    cta: 'Claim Founding Member spot',
    ctaHref: '/register',
    features: [
      'Everything in PRO Compliance',
      'OTC bulletin board — CBAM & GO certificates',
      'Real-time match alerts',
      'MSR (Market Stability Reserve) alerts',
      'EU Sanctions screening (VIES)',
      'EFET contract generation',
      'Priority support',
    ],
  },
]

export function PricingCards() {
  const [annual, setAnnual] = useState(true)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">

      {/* Toggle */}
      <div className="mb-10 flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${!annual ? 'text-navy' : 'text-slate-400'}`}>Monthly</span>
        <button
          type="button"
          onClick={() => setAnnual((v) => !v)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${annual ? 'bg-cobalt' : 'bg-slate-300'}`}
          aria-label="Toggle billing period"
        >
          <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-navy' : 'text-slate-400'}`}>
          Annual{' '}
          <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Save 2 months</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = annual ? plan.annual : plan.monthly
          const showEarlyBird = annual && plan.earlyBird !== null

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border ${
                plan.highlight
                  ? 'border-cobalt shadow-xl shadow-cobalt/10'
                  : 'border-slate-200'
              } bg-white p-8`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-cobalt px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-navy">{plan.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {showEarlyBird ? (
                  <>
                    {/* Early Bird */}
                    <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="size-4 text-amber-600" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wide text-amber-700">Founding Member — 10 spots</span>
                      </div>
                      <p className="mt-2">
                        <span className="text-3xl font-extrabold text-amber-800">1,990 €</span>
                        <span className="ml-1 text-sm text-amber-700">/year</span>
                      </p>
                      <p className="mt-0.5 text-xs text-amber-600 line-through">{plan.annual.toLocaleString('en')} €/year</p>
                      <p className="mt-1 text-xs font-semibold text-amber-700">You save 500 € — locked in forever</p>
                    </div>
                    <p className="text-sm text-slate-500">
                      or <strong className="text-slate-700">{plan.monthly} €/month</strong> billed monthly
                    </p>
                  </>
                ) : price === 0 ? (
                  <p className="text-4xl font-extrabold text-navy">Free</p>
                ) : (
                  <>
                    <p>
                      <span className="text-4xl font-extrabold text-navy">{price.toLocaleString('en')} €</span>
                      <span className="ml-1 text-sm text-slate-500">{annual ? '/year' : '/month'}</span>
                    </p>
                    {annual && (
                      <p className="mt-1 text-xs text-slate-500">
                        {plan.monthly} €/month billed monthly
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`mb-8 block rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-cobalt text-white hover:bg-[#1d4fe6]'
                    : 'border border-navy bg-white text-navy hover:bg-slate-50'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-cobalt" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        All prices exclude VAT where applicable. Indicative calculations only. Not legal or financial advice.
      </p>
    </section>
  )
}
