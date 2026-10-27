import { Atom, Building2, Factory, Layers, Sprout, Zap } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const SECTORS = [
  { icon: Factory, name: 'Iron & steel', codes: 'CN 72, 73' },
  { icon: Layers, name: 'Aluminium', codes: 'CN 76' },
  { icon: Building2, name: 'Cement', codes: 'CN 2507, 2523' },
  { icon: Sprout, name: 'Fertilisers', codes: 'CN 2808, 2814, 31' },
  { icon: Atom, name: 'Hydrogen', codes: 'CN 2804 10' },
  { icon: Zap, name: 'Electricity', codes: 'CN 2716' },
]

const AUDIENCES = ['Importers & distributors', 'Manufacturers', 'Customs representatives', 'Enterprise groups']

export function Sectors() {
  return (
    <section id="sectors" className="scroll-mt-16 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Coverage"
            title="Every CBAM sector, every goods category"
            description="Pre-loaded emission factors and default values for all goods in scope of Annex I."
          />
          <ul className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end" aria-label="Who uses Carbonis">
            {AUDIENCES.map((a) => (
              <li key={a} className="rounded-full border border-border px-3 py-1.5 text-sm text-navy">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {SECTORS.map(({ icon: Icon, name, codes }) => (
            <li
              key={name}
              className="group rounded-xl border border-border p-6 transition-colors hover:border-cobalt hover:bg-cobalt-soft"
            >
              <Icon className="size-6 text-navy transition-colors group-hover:text-cobalt" aria-hidden />
              <p className="mt-8 font-semibold text-navy">{name}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{codes}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
