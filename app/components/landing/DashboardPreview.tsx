import { CheckCircle2, FileText, TrendingDown } from 'lucide-react'

const KPIS = [
  { label: 'Embedded emissions', value: '12,480', unit: 't CO₂e', note: '−8.2% vs. Q2', tone: 'text-emerald-600' },
  { label: 'CBAM certificates', value: '11,930', unit: 'required', note: '€ 780k est.', tone: 'text-muted-foreground' },
  { label: 'Supplier data', value: '94%', unit: 'verified', note: '3 pending', tone: 'text-amber-600' },
]

const BARS = [62, 70, 58, 74, 66, 80, 72, 64, 69, 60, 55, 52]

const DECLARATIONS = [
  { name: 'Hot-rolled coil · CN 7208', origin: 'Türkiye', status: 'Verified' },
  { name: 'Unwrought aluminium · CN 7601', origin: 'India', status: 'In review' },
  { name: 'Clinker · CN 2523', origin: 'Egypt', status: 'Verified' },
]

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_30px_80px_-20px_rgba(11,36,113,0.25)]">
        <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 truncate rounded bg-white px-3 py-1 font-mono text-[11px] text-muted-foreground">
            app.carbonis.eu/cbam/overview
          </span>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Acme Europe GmbH</p>
              <p className="text-base font-semibold text-navy">CBAM overview · 2026</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5" aria-hidden />
              On track
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-lg border border-border p-3">
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-navy">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.unit}</p>
                <p className={`mt-1 text-[10px] font-medium ${k.tone}`}>{k.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-border p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">Monthly embedded emissions</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                <TrendingDown className="size-3" aria-hidden />
                Trending down
              </span>
            </div>
            <div className="flex h-20 items-end gap-1.5" aria-hidden>
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className={i >= 9 ? 'flex-1 rounded-sm bg-cobalt' : 'flex-1 rounded-sm bg-navy/15'}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {DECLARATIONS.map((d) => (
              <li key={d.name} className="flex items-center gap-3 px-3 py-2">
                <FileText className="size-3.5 shrink-0 text-cobalt" aria-hidden />
                <span className="flex-1 truncate text-[11px] text-foreground">{d.name}</span>
                <span className="hidden text-[10px] text-muted-foreground sm:inline">{d.origin}</span>
                <span
                  className={
                    d.status === 'Verified'
                      ? 'rounded bg-cobalt-soft px-1.5 py-0.5 text-[10px] font-medium text-cobalt'
                      : 'rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700'
                  }
                >
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
