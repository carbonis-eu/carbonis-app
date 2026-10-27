import Link from 'next/link'
import { ArrowRight, Check, Lock, Zap } from 'lucide-react'

// ─── SELLER PATH ─────────────────────────────────────────────────────────────

const SELLER_STEPS = [
  { step: '01', title: 'Register & verify', desc: 'VAT/VIES check in 24 h. No paperwork.' },
  { step: '02', title: 'List your surplus', desc: 'CBAM certificates, GO, EUAs — one form.' },
  { step: '03', title: 'Buyer contacts you', desc: 'You get an email. You decide to sell or not.' },
  { step: '04', title: 'EFET contract generated', desc: 'Standard EU contract. No lawyers needed.' },
]

function SellerPath() {
  return (
    <div className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 lg:p-10">
      <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        For certificate sellers
      </div>
      <h3 className="mt-4 text-balance text-2xl font-extrabold text-navy sm:text-3xl">
        You have surplus certificates.<br />
        <span className="text-cobalt">We find you a buyer — free, forever.</span>
      </h3>
      <p className="mt-3 text-base text-slate-600">
        Every CBAM certificate that expires unused is dead capital. List it on Carbonis and let verified EU buyers come to you. No broker. No platform fee. No subscription.
      </p>

      <ol className="mt-8 flex flex-col gap-5">
        {SELLER_STEPS.map(({ step, title, desc }) => (
          <li key={step} className="flex items-start gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-xs font-bold text-cobalt">
              {step}
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">{title}</p>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-semibold text-green-800">
          Free — no credit card, no trial, no catch.
        </p>
        <p className="mt-1 text-xs text-green-700">
          The Seller tier is permanently free. We make money when compliance teams pay for PRO — not from sellers.
        </p>
      </div>

      <Link
        href="/register"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-navy bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-slate-50"
      >
        List certificates for free
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  )
}

// ─── PRO PATH ────────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    pain: 'Excel + CBAM regulation = 4 hours per declaration',
    fix: 'Carbonis declaration builder: 12 minutes. XML ready.',
  },
  {
    pain: 'One missed CBAM deadline = penalty up to 3× certificate value',
    fix: 'Automatic deadline tracking + regulatory change alerts.',
  },
  {
    pain: 'Consultant invoice for CBAM support: 1,500–5,000 € per year',
    fix: 'PRO Compliance: 79 €/month. Built by compliance specialists.',
  },
]

const PRO_INCLUDES = [
  'Multi-shipment CBAM planner',
  'Supplier emissions request tool',
  'XML & PDF export (EU CBAM format)',
  'CBAM declaration builder',
  'AI cost forecast',
  'Compliance dashboard & deadline alerts',
]

function ProPath() {
  return (
    <div className="relative flex flex-col rounded-2xl border border-cobalt bg-white p-8 shadow-xl shadow-cobalt/10 lg:p-10">
      <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-cobalt/30 bg-cobalt/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cobalt">
        For compliance teams & importers
      </div>
      <h3 className="mt-4 text-balance text-2xl font-extrabold text-navy sm:text-3xl">
        Stop doing CBAM on Excel.<br />
        <span className="text-cobalt">Your first declaration costs more than our annual plan.</span>
      </h3>
      <p className="mt-3 text-base text-slate-600">
        CBAM is not a one-time form. It is a quarterly obligation with embedded data from every supplier in your chain. Without the right tools, it will eat your team alive.
      </p>

      <ul className="mt-8 flex flex-col gap-4">
        {PAIN_POINTS.map(({ pain, fix }) => (
          <li key={pain} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Problem</p>
            <p className="mt-1 text-sm text-slate-700">{pain}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cobalt">Carbonis fix</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{fix}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">What PRO Compliance includes</p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PRO_INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="size-4 shrink-0 text-cobalt" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cobalt px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d4fe6]"
        >
          Start 30-day free trial
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <p className="text-xs text-slate-500">No credit card. Cancel anytime.</p>
      </div>
    </div>
  )
}

// ─── FOUNDING MEMBER SCARCITY ─────────────────────────────────────────────────

function FoundingMemberBand() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2">
            <Zap className="size-4 text-amber-600" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Founding Member — 10 spots only
            </span>
          </div>
          <h3 className="text-balance text-2xl font-extrabold text-amber-900 sm:text-3xl">
            PRO Trading at 1,990 €/year.<br />Locked in forever.
          </h3>
          <p className="mt-3 text-sm text-amber-800">
            PRO Trading normally costs 2,490 €/year (249 €/month). The first 10 companies get the founding price — 1,990 €/year, permanently. Price never goes up for you, ever, as long as you stay subscribed.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              'CBAM + ETS compliance tools',
              'OTC bulletin board — the only one in the EU',
              'ETS cost tracker with MSR alerts',
              'EFET contract auto-generation',
              'Priority support',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-amber-800">
                <Check className="size-4 shrink-0 text-amber-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right">
          <div>
            <p className="text-4xl font-extrabold text-amber-900">1,990 €</p>
            <p className="text-sm text-amber-700">/year · founding price</p>
            <p className="mt-1 text-xs text-amber-600 line-through">2,490 €/year regular</p>
            <p className="mt-1 text-xs font-semibold text-amber-700">You save 500 €</p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-800"
          >
            Claim founding spot
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <p className="text-xs text-amber-600">
            Starts with 30-day free trial.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── OBJECTION CRUSHER ───────────────────────────────────────────────────────

const OBJECTIONS = [
  {
    q: '"We already handle CBAM in-house."',
    a: 'Great. Our tools make your team 5× faster — same compliance, a fraction of the manual work. The XML export alone saves hours per quarter.',
  },
  {
    q: '"Our volumes are too small to worry about."',
    a: 'CBAM thresholds apply from the first tonne of imported Annex I goods. Below-threshold importers can still face spot checks and must be able to demonstrate compliance.',
  },
  {
    q: '"We\'ll deal with it when it becomes mandatory."',
    a: 'The transitional phase ended in December 2025. Full financial obligations apply from 2026. The fines for non-compliance are up to 3× the certificate value.',
  },
]

function ObjectionCrusher() {
  return (
    <div>
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-slate-400">
        We hear this a lot
      </p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {OBJECTIONS.map(({ q, a }) => (
          <li key={q} className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold italic text-slate-600">{q}</p>
            <p className="mt-3 text-sm text-slate-500">{a}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function ConversionPaths() {
  return (
    <section id="get-started" className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-7xl space-y-16 px-6 lg:px-8">

        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Two ways to join Carbonis.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Whether you have certificates to sell or obligations to meet — there is a path for you.
          </p>
        </div>

        {/* Two paths */}
        <div className="grid gap-8 lg:grid-cols-2">
          <SellerPath />
          <ProPath />
        </div>

        {/* Founding member scarcity band */}
        <FoundingMemberBand />

        {/* Objection crusher */}
        <ObjectionCrusher />

        {/* Link to full pricing */}
        <p className="text-center text-sm text-slate-400">
          Want to compare every feature?{' '}
          <Link href="/pricing" className="font-semibold text-cobalt hover:underline">
            See full pricing →
          </Link>
        </p>

      </div>
    </section>
  )
}
