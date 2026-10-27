import { Check } from 'lucide-react'
import InlineCbamCalc from '../InlineCbamCalc'
import { SectionHeading } from './SectionHeading'

const POINTS = [
  'Uses official EU default emission factors',
  'Deducts carbon prices paid at origin',
  'Priced on the live EU ETS benchmark',
]

export function CalculatorSection({ etsPrice }: { etsPrice: number }) {
  return (
    <section id="calculator" className="scroll-mt-16 border-y border-border bg-muted py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Free CBAM calculator"
            title="Know your exposure before your first declaration"
            description="Get an indicative CBAM cost for any covered good in seconds. Create an account to model your full import portfolio."
          />
          <ul className="mt-8 flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-navy">
                <span className="flex size-5 items-center justify-center rounded-full bg-cobalt">
                  <Check className="size-3 text-white" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <InlineCbamCalc etsPrice={etsPrice} />
      </div>
    </section>
  )
}
