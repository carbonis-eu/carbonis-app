import Link from 'next/link'
import { Check, Zap, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    id: 'seller',
    name: 'Seller',
    price: 'Free',
    sub: 'forever',
    desc: 'List surplus certificates. Get matched. Zero cost.',
    highlight: false,
    badge: null,
    features: [
      'VAT/VIES-verified listing',
      'Publish CBAM & GO certificates',
      'EFET contract on match',
    ],
    cta: 'Create free account',
    ctaHref: '/register',
  },
  {
    id: 'compliance',
    name: 'PRO Compliance',
    price: '79 €',
    sub: '/month · 790 €/year',
    desc: 'Calculate, track and export your CBAM obligations.',
    highlight: false,
    badge: null,
    features: [
      'CBAM & ETS calculator (all sectors)',
      'Compliance dashboard',
      'XML/PDF export — EU CBAM format',
      'AI cost forecast',
      'Regulatory alerts',
    ],
    cta: 'Start free trial',
    ctaHref: '/register',
  },
  {
    id: 'trading',
    name: 'PRO Trading',
    price: '249 €',
    sub: '/month · 2,490 €/year',
    desc: 'The only EU platform with built-in OTC certificate trading.',
    highlight: true,
    badge: '⚡ 10 founding spots at 1,990 €/year',
    features: [
      'Everything in PRO Compliance',
      'OTC bulletin board (CBAM + GO)',
      'Real-time match alerts',
      'MSR & sanctions screening',
      'EFET contract generation',
    ],
    cta: 'Claim founding spot',
    ctaHref: '/register',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 inline-block rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800">
            <Zap className="mr-1 inline-block size-3.5" aria-hidden />
            Only 10 founding member spots available
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Transparent pricing. No surprises.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free for 30 days. No credit card required.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 ${
                plan.highlight ? 'border-cobalt shadow-lg shadow-cobalt/10' : 'border-slate-200'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cobalt px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              {plan.badge && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-base font-bold text-navy">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.desc}</p>
              <div className="my-5">
                <span className="text-3xl font-extrabold text-navy">{plan.price}</span>
                <span className="ml-1 text-sm text-slate-500">{plan.sub}</span>
              </div>
              <Link
                href={plan.ctaHref}
                className={`mb-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-cobalt text-white hover:bg-[#1d4fe6]'
                    : 'border border-navy bg-white text-navy hover:bg-slate-50'
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-cobalt" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-medium text-cobalt hover:underline">
            Compare all features <ArrowRight className="size-4" aria-hidden />
          </Link>
          <p className="mt-3 text-xs text-slate-400">
            All prices exclude VAT. Indicative calculations only. Not legal or financial advice.
          </p>
        </div>

      </div>
    </section>
  )
}
