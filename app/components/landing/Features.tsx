import { BarChart3, Calculator, FileCheck2, Network, Repeat, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const FEATURES = [
  {
    icon: Network,
    title: 'Supplier data collection',
    body: 'Invite non-EU installations to a secure portal and collect verified embedded-emissions data using the official EU communication template.',
  },
  {
    icon: Calculator,
    title: 'Liability calculation',
    body: 'Calculate direct and indirect emissions per CN code, apply default values where needed, and deduct carbon prices paid in the country of origin.',
  },
  {
    icon: FileCheck2,
    title: 'Audit-ready declarations',
    body: 'Generate annual CBAM declarations in the XML format required by the CBAM Registry, with a full audit trail for accredited verifiers.',
  },
  {
    icon: Repeat,
    title: 'Certificate management',
    body: 'Forecast certificate requirements, track quarterly holding obligations, and plan purchases against live EU ETS price movements.',
  },
  {
    icon: BarChart3,
    title: 'Sourcing scenarios',
    body: 'Compare suppliers and origin countries side by side to understand how procurement decisions change your carbon cost.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-grade security',
    body: 'EU data residency, role-based access, SSO and encryption at rest and in transit — built for regulated industries.',
  },
]

export function Features() {
  return (
    <section id="platform" className="scroll-mt-16 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="The platform"
          title="One system of record for carbon compliance"
          description="Replace spreadsheets and email chains with a single workflow — from supplier outreach to submitted declaration."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="bg-white p-8 transition-colors hover:bg-muted">
              <div className="flex size-11 items-center justify-center rounded-lg bg-cobalt-soft">
                <Icon className="size-5 text-cobalt" aria-hidden />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
