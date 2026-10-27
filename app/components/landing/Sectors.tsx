import Link from 'next/link'
import { SectionHeading } from './SectionHeading'

const SECTORS = [
  { name: 'Iron & Steel', codes: 'CN 72, 73', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=420&fit=crop&auto=format&q=75', color: '#1e3a5f' },
  { name: 'Aluminium', codes: 'CN 76', img: 'https://images.unsplash.com/photo-1547555706-54bcf05bbad1?w=600&h=420&fit=crop&auto=format&q=75', color: '#2d4a7a' },
  { name: 'Cement', codes: 'CN 2507, 2523', img: 'https://images.unsplash.com/photo-1666219462105-2909c2d72d01?w=600&h=420&fit=crop&auto=format&q=75', color: '#374151' },
  { name: 'Fertilisers', codes: 'CN 2808, 2814, 31', img: 'https://images.unsplash.com/photo-1591630529805-63486bbce578?w=600&h=420&fit=crop&auto=format&q=75', color: '#1a4731' },
  { name: 'Hydrogen', codes: 'CN 2804 10', img: 'https://images.unsplash.com/photo-1759299983582-085079c31bdc?w=600&h=420&fit=crop&auto=format&q=75', color: '#0c3547' },
  { name: 'Electricity', codes: 'CN 2716', img: 'https://images.unsplash.com/photo-1509391111737-9b07f052f6b6?w=600&h=420&fit=crop&auto=format&q=75', color: '#1a2f5e' },
]

export function Sectors() {
  return (
    <section id="sectors" className="scroll-mt-16 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <SectionHeading
          eyebrow="CBAM Coverage"
          title="Six sectors. Every EU importer."
          description="Carbonis covers all six Annex I sectors with pre-loaded EU default emission factors and automated reporting."
        />

        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cobalt/30 bg-cobalt/5 px-4 py-1.5 text-sm font-medium text-cobalt">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1.5 8h13M8 1.5a10 10 0 010 13M8 1.5a10 10 0 000 13" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Applies to all 27 EU member states — Regulation (EU) 2023/956
          </span>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s) => (
            <li key={s.name} className="group relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.name} width={600} height={420} loading="lazy"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${s.color}ee 0%, ${s.color}99 45%, transparent 70%)` }} />
              <div className="absolute right-3 top-3">
                <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">{s.codes}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-lg font-bold text-white">{s.name}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-border bg-white p-8 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-navy">Need detailed information about CBAM coverage?</p>
            <p className="mt-1 text-sm text-muted-foreground">Learn about sector scope, who must comply, the compliance process and key deadlines.</p>
          </div>
          <Link href="/cbam" className="shrink-0 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-deep">
            What is CBAM? →
          </Link>
        </div>

      </div>
    </section>
  )
}
