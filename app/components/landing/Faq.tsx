import { Plus } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const FAQS = [
  {
    q: 'Who needs to comply with CBAM?',
    a: 'Any EU importer bringing in more than 50 tonnes per year of goods covered by CBAM — iron and steel, aluminium, cement, fertilisers, hydrogen or electricity — must become an authorised CBAM declarant.',
  },
  {
    q: 'What if my suppliers cannot provide emissions data?',
    a: 'Carbonis applies the EU default values for the relevant CN code and country, clearly flagged in your declaration. As verified supplier data comes in, your liability is recalculated automatically.',
  },
  {
    q: 'How are CBAM certificates priced?',
    a: 'Certificate prices follow the average EU ETS auction price. Carbonis tracks the benchmark continuously so you can forecast cost and plan purchases.',
  },
  {
    q: 'Where is my data stored?',
    a: 'All customer data is hosted in EU data centres, encrypted at rest and in transit, and processed in line with GDPR.',
  },
  {
    q: 'Can Carbonis support other reporting frameworks?',
    a: 'Yes. The same emissions data model supports EU ETS monitoring, product carbon footprints and CSRD / ESRS climate disclosures.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
        <SectionHeading align="left" eyebrow="FAQ" title="Questions compliance teams ask us" />
        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-cobalt transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 pr-10 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
