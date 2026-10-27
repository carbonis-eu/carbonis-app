'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Check, Zap } from 'lucide-react'

type PlanFeature = {
  label: string
  tooltip?: string
  isSection?: boolean
}

type Plan = {
  id: string
  name: string
  tagline: string
  monthly: number
  annual: number
  earlyBird: number | null
  highlight: boolean
  cta: string
  ctaHref: string
  features: PlanFeature[]
}

const PLANS: Plan[] = [
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
      { label: 'VAT/VIES-verified company listing' },
      { label: 'Publish CBAM & GO surplus certificates' },
      { label: 'Automatic view counter' },
      { label: 'Inquiry alerts by email' },
      { label: 'EFET contract template on match' },
      { label: 'No subscription. No commitment.' },
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
      { label: 'Everything in Seller' },
      { label: 'CBAM & ETS calculator — all Annex I sectors', tooltip: 'Covers all six CBAM sectors: cement, iron & steel, aluminium, fertilisers, electricity, and hydrogen. Basic version also available free at carbonis.eu/cbam.' },
      { label: 'Compliance dashboard' },
      { label: 'Regulatory change alerts' },
      { label: 'Email support' },
      { label: 'Advanced tools', isSection: true },
      { label: 'Multi-shipment CBAM planner', tooltip: 'Plan your annual CBAM liability across multiple import shipments. Input CN code, quantity, country of origin and embedded CO₂ per shipment.' },
      { label: 'Supplier emissions request tool', tooltip: 'Send standardised embedded emissions questionnaires to your suppliers. Responses import directly into your CBAM declaration.' },
      { label: 'XML & PDF export (EU CBAM format)', tooltip: 'Export your CBAM declarations in the official DG TAXUD XML format, ready to submit to the EU CBAM Registry.' },
      { label: 'CBAM declaration builder', tooltip: 'Step-by-step wizard to build a compliant CBAM declaration. Validates all required fields before export.' },
      { label: 'AI cost forecast for upcoming declarations', tooltip: 'AI-powered projection of your future CBAM certificate costs based on your trade volumes and current carbon price data.' },
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
      { label: 'Everything in PRO Compliance' },
      { label: 'Advanced tools', isSection: true },
      { label: 'ETS cost tracker', tooltip: 'Track EU ETS allowance prices in real time. Set price alerts and get MSR (Market Stability Reserve) notifications that affect certificate supply.' },
      { label: 'OTC bulletin board (CBAM + GO)', tooltip: 'Post and browse bilateral carbon certificate offers. No exchange fee — direct counterparty negotiation.' },
      { label: 'Match alerts & MSR notifications', tooltip: 'Get notified when a matching offer appears on the bulletin board, or when MSR triggers a market intervention.' },
      { label: 'EU Sanctions screening (VIES)' },
      { label: 'EFET contract generation' },
      { label: 'Priority support' },
    ],
  },
]

function FeatureTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0, cursor: 'help' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
      aria-label={text}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="6" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M7 6v4M7 4.5v-.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '130%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '12px',
            lineHeight: '1.5',
            padding: '8px 10px',
            borderRadius: '8px',
            maxWidth: '220px',
            width: 'max-content',
            whiteSpace: 'normal',
            zIndex: 20,
            pointerEvents: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {text}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '5px solid transparent',
              borderTopColor: '#1e293b',
            }}
          />
        </span>
      )}
    </span>
  )
}

export function PricingCards() {
  const [annual, setAnnual] = useState(true)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">

      {/* Billing toggle */}
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

      {/* Plan cards */}
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

              {/* Price display */}
              <div className="mb-6">
                {showEarlyBird ? (
                  <>
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

              {/* Feature list */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((f, i) =>
                  f.isSection ? (
                    <li
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid #e2e8f0',
                      }}
                    >
                      {f.label}
                    </li>
                  ) : (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="mt-0.5 size-4 shrink-0 text-cobalt" aria-hidden />
                      <span className="flex flex-1 items-start gap-1.5">
                        {f.label}
                        {f.tooltip && <FeatureTooltip text={f.tooltip} />}
                      </span>
                    </li>
                  )
                )}
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
