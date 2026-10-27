import { SectionHeading } from './SectionHeading'

const MILESTONES = [
  {
    date: 'Oct 2023',
    title: 'Transitional period begins',
    body: 'Quarterly reporting of embedded emissions — no financial obligation yet.',
    state: 'done',
  },
  {
    date: 'Jan 2026',
    title: 'Definitive period starts',
    body: 'Importers above 50 t per year must be authorised CBAM declarants.',
    state: 'current',
  },
  {
    date: 'Feb 2027',
    title: 'Certificate sales open',
    body: 'CBAM certificates become available, priced on the EU ETS auction average.',
    state: 'upcoming',
  },
  {
    date: 'Sep 2027',
    title: 'First annual declaration',
    body: 'Declare 2026 imports and surrender the matching number of certificates.',
    state: 'upcoming',
  },
] as const

export function RegulationTimeline() {
  return (
    <section id="regulation" className="scroll-mt-16 bg-navy py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Regulation (EU) 2023/956"
          title="The CBAM financial phase has begun"
          description="From 2026, every tonne of embedded emissions carries a price. Carbonis keeps you ahead of each obligation."
        />

        <ol className="mt-16 grid gap-6 md:grid-cols-4">
          {MILESTONES.map((m) => (
            <li
              key={m.title}
              className={`relative rounded-xl border p-6 ${
                m.state === 'current' ? 'border-cobalt bg-cobalt' : 'border-white/15 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-white">{m.date}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    m.state === 'current'
                      ? 'bg-white text-cobalt'
                      : m.state === 'done'
                        ? 'bg-white/10 text-blue-100'
                        : 'border border-white/20 text-blue-100'
                  }`}
                >
                  {m.state === 'current' ? 'Now' : m.state === 'done' ? 'Completed' : 'Upcoming'}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{m.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${m.state === 'current' ? 'text-white/90' : 'text-blue-100/75'}`}>
                {m.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
