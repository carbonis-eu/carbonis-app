const STATS = [
  { value: '6', label: 'CBAM sectors covered', detail: 'Steel, aluminium, cement, fertilisers, hydrogen, electricity' },
  { value: '27', label: 'EU member states', detail: 'Aligned with every national competent authority' },
  { value: '400+', label: 'CN codes mapped', detail: 'Default values and emission factors built in' },
  { value: '< 1 day', label: 'To first declaration', detail: 'Guided onboarding for compliance teams' },
]

export function StatsBand() {
  return (
    <section aria-label="Carbonis at a glance" className="border-b border-border bg-white">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-6 lg:grid-cols-4 lg:divide-x lg:px-8">
        {STATS.map((s) => (
          <div key={s.label} className="px-2 py-10 lg:px-8">
            <dt className="text-sm font-medium text-navy">{s.label}</dt>
            <dd className="mt-2 text-4xl font-semibold tracking-tight text-cobalt">{s.value}</dd>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
