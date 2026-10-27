import { SectionHeading } from './SectionHeading'

const STEPS = [
  {
    n: '01',
    title: 'Connect your imports',
    body: 'Upload customs data or connect your ERP. Carbonis maps every line to CN codes and flags CBAM-relevant goods automatically.',
  },
  {
    n: '02',
    title: 'Collect supplier emissions',
    body: 'Suppliers submit installation-level data through a guided portal. Gaps are filled with EU default values, clearly labelled.',
  },
  {
    n: '03',
    title: 'Calculate and verify',
    body: 'Liability is calculated per shipment and per period, with carbon-price deductions and a complete evidence trail for verifiers.',
  },
  {
    n: '04',
    title: 'Declare and surrender',
    body: 'Export a registry-ready declaration and a certificate plan — reviewed, approved and signed off inside one workflow.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-muted py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title="From customs entry to compliant declaration"
            description="A structured four-step workflow your finance, procurement and sustainability teams can share."
          />
        </div>

        <ol className="flex flex-col gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-6 rounded-xl border border-border bg-white p-6 sm:p-8">
              <span className="font-mono text-sm font-semibold text-cobalt">{s.n}</span>
              <div>
                <h3 className="text-lg font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
