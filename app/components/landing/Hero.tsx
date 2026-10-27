import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { DashboardPreview } from './DashboardPreview'

const FRAMEWORKS = ['CBAM', 'EU ETS', 'CSRD / ESRS', 'GHG Protocol']

export function Hero({ etsPrice }: { etsPrice: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-50 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-28">
        <div>
          <a
            href="#regulation"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-navy shadow-sm transition-colors hover:border-cobalt/40"
          >
            <span className="rounded-full bg-cobalt px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              2026
            </span>
            CBAM definitive period is now in force
            <ArrowRight className="size-3.5" aria-hidden />
          </a>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            EU carbon compliance, <span className="text-cobalt">without the complexity.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Carbonis gives EU importers and manufacturers one platform to collect supplier emissions data, calculate
            CBAM liability, and file audit-ready declarations under Regulation (EU) 2023/956.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
            >
              Start free trial
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center justify-center rounded-md border border-border bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-muted"
            >
              Estimate your liability
            </a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ✓ 30-day free trial &nbsp;·&nbsp; ✓ No credit card required &nbsp;·&nbsp; ✓ Cancel anytime
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            For importers, certificate sellers, and compliance teams
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-cobalt" aria-hidden />
              EU-hosted · GDPR compliant
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              EU ETS{' '}
              <span className="font-semibold text-navy">€{etsPrice.toFixed(2)}</span>
              <span className="text-xs">/ tCO₂</span>
            </div>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Supported frameworks">
            {FRAMEWORKS.map((f) => (
              <li key={f} className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-navy">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}
