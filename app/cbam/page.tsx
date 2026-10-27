'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  CBAM_PRODUCTS,
  ORIGIN_COUNTRIES,
  SECTOR_LABELS,
  type CbamSector,
  type OriginCountry,
} from '@/lib/cbam/data'
import { SiteHeader } from '../components/landing/SiteHeader'
import { SiteFooter } from '../components/landing/SiteFooter'

interface EtsPrice { price: number; isLive: boolean; source: string }
interface CalcResult {
  grossEmissions: number; countryCredit: number; netEmissions: number
  grossCost: number; countryDeduction: number; netCost: number; etsPrice: number
}

function formatEur(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function calcCbam(qty: number, ef: number, etsPrice: number, country: OriginCountry): CalcResult {
  const grossEmissions = qty * ef
  const countryCredit = Math.min(country.carbonPrice, etsPrice)
  const grossCost = grossEmissions * etsPrice
  const countryDeduction = grossEmissions * countryCredit
  return { grossEmissions, countryCredit, netEmissions: grossEmissions, grossCost, countryDeduction, netCost: Math.max(0, grossCost - countryDeduction), etsPrice }
}

const SECTORS_PHOTOS = [
  { key: 'steel' as CbamSector, name: 'Iron & Steel', codes: 'CN 72, 73', desc: 'Crude steel, rolled products, pipes and tubes', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&h=500&fit=crop&auto=format&q=80', accent: '#1e3a5f' },
  { key: 'aluminum' as CbamSector, name: 'Aluminium', codes: 'CN 76', desc: 'Primary aluminium, alloys and downstream products', img: 'https://images.unsplash.com/photo-1547555706-54bcf05bbad1?w=700&h=500&fit=crop&auto=format&q=80', accent: '#2d4a7a' },
  { key: 'cement' as CbamSector, name: 'Cement', codes: 'CN 2507, 2523', desc: 'Clinker, Portland cement and construction materials', img: 'https://images.unsplash.com/photo-1666219462105-2909c2d72d01?w=700&h=500&fit=crop&auto=format&q=80', accent: '#374151' },
  { key: 'fertilizers' as CbamSector, name: 'Fertilisers', codes: 'CN 2808, 2814, 31', desc: 'Nitric acid, ammonia and nitrogen-based fertilisers', img: 'https://images.unsplash.com/photo-1591630529805-63486bbce578?w=700&h=500&fit=crop&auto=format&q=80', accent: '#1a4731' },
  { key: 'hydrogen' as CbamSector, name: 'Hydrogen', codes: 'CN 2804 10', desc: 'Pure hydrogen for industrial and energy applications', img: 'https://images.unsplash.com/photo-1759299983582-085079c31bdc?w=700&h=500&fit=crop&auto=format&q=80', accent: '#0c3547' },
  { key: 'electricity' as CbamSector, name: 'Electricity', codes: 'CN 2716', desc: 'Electricity imported via cross-border interconnectors', img: 'https://images.unsplash.com/photo-1509391111737-9b07f052f6b6?w=700&h=500&fit=crop&auto=format&q=80', accent: '#1a2f5e' },
]

const STEPS = [
  { num: '01', title: 'Get authorised declarant status', body: 'Register in the EU CBAM Registry. Required for all importers exceeding 50 t/year of covered goods. Deadline: already in force from 1 Jan 2026.' },
  { num: '02', title: 'Collect embedded emissions data', body: 'Gather verified carbon data from your suppliers (actual values) or use EU Commission default values — Carbonis tracks both methods automatically.' },
  { num: '03', title: 'File your annual declaration', body: 'Submit your CBAM declaration by 31 May each year, covering all imports from the prior calendar year with verified emission data.' },
  { num: '04', title: 'Purchase & surrender certificates', body: 'Buy CBAM certificates at the EU ETS quarterly auction price (1 cert = 1 tCO₂e). Surrender the exact number corresponding to your declared emissions.' },
]

const DEADLINES = [
  { date: 'Oct 2023 – Dec 2025', label: 'Transitional period', desc: 'Reporting only, no financial obligation', done: true },
  { date: '1 Jan 2026', label: 'Definitive period begins', desc: 'Authorised declarant status required for imports above 50 t/year', done: true },
  { date: '1 Feb – 30 Sep 2027', label: 'Certificate purchase window', desc: 'Buy and surrender CBAM certificates for 2026 imports', done: false },
  { date: '31 May 2027', label: 'First annual declaration due', desc: 'File CBAM declaration covering 2026 imports (Art. 6, Regulation (EU) 2023/956)', done: false },
  { date: 'Annually thereafter', label: 'Recurring obligation', desc: 'Declaration by 31 May, certificate surrender by 30 September each year', done: false },
]

const CALC_SECTORS: CbamSector[] = ['steel', 'cement', 'aluminum', 'fertilizers', 'hydrogen', 'electricity']

export default function CbamPage() {
  const [etsPrice, setEtsPrice] = useState<EtsPrice | null>(null)
  const [sector, setSector] = useState<CbamSector>('steel')
  const [productId, setProductId] = useState<string>('steel-crude-bof')
  const [quantity, setQuantity] = useState<string>('')
  const [countryCode, setCountryCode] = useState<string>('CN')
  const [customEf, setCustomEf] = useState<string>('')
  const [useCustomEf, setUseCustomEf] = useState(false)
  const [result, setResult] = useState<CalcResult | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetch('/api/ets-price').then(r => r.json()).then(setEtsPrice).catch(() => null)
  }, [])

  const sectorProducts = CBAM_PRODUCTS.filter(p => p.sector === sector)
  const selectedProduct = CBAM_PRODUCTS.find(p => p.id === productId) ?? sectorProducts[0]
  const selectedCountry = ORIGIN_COUNTRIES.find(c => c.code === countryCode) ?? ORIGIN_COUNTRIES[0]
  const ef = useCustomEf && customEf ? parseFloat(customEf) : (selectedProduct?.emissionFactor ?? 1)

  function handleSectorChange(s: CbamSector) {
    setSector(s)
    const first = CBAM_PRODUCTS.find(p => p.sector === s)
    if (first) setProductId(first.id)
    setResult(null)
  }

  const handleCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    setTilt({ x, y })
  }, [])

  const bestSavings = result
    ? ORIGIN_COUNTRIES.filter(c => c.code !== countryCode)
        .map(c => ({ country: c, cost: calcCbam(parseFloat(quantity), ef, etsPrice!.price, c).netCost }))
        .sort((a, b) => a.cost - b.cost)[0]
    : null

  return (
    <>
      <SiteHeader />
      <main>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 mb-6">
              Regulation (EU) 2023/956 &mdash; All 27 EU member states
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ letterSpacing: '-0.03em' }}>
              Carbon Border Adjustment<br />
              <span className="text-[#60a5fa]">Mechanism (CBAM)</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
              The EU&apos;s landmark climate policy placing a carbon price on imports — ensuring fair competition between EU and non-EU producers.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="#calculator" className="rounded-lg bg-cobalt px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1a4ce0] transition-colors">
                Calculate your liability ↓
              </a>
              <a href="#sectors" className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                See covered sectors ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── WHAT IS CBAM ── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">The basics</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                  What is CBAM and why does it matter?
                </h2>
                <p className="mt-5 text-base text-slate-600 leading-relaxed">
                  CBAM prevents <strong>carbon leakage</strong> — the risk that EU climate policies push carbon-intensive production to countries with weaker standards. Importers of covered goods must purchase <strong>CBAM certificates</strong> equal to the carbon price they would have paid under the EU ETS.
                </p>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  It applies across all <strong>27 EU member states</strong> to imports from any non-EU country, with deductions where equivalent carbon pricing already exists in the country of origin.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '27', label: 'EU member states covered', icon: '🇪🇺' },
                  { value: '6', label: 'Annex I sectors in scope', icon: '🏭' },
                  { value: '€75+', label: 'Certificate price (2026)', icon: '💶' },
                  { value: '2050', label: 'EU climate neutrality goal', icon: '🌱' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-slate-50 p-5">
                    <span className="text-2xl">{s.icon}</span>
                    <p className="mt-3 text-2xl font-extrabold text-navy">{s.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTORS ── */}
        <section id="sectors" className="scroll-mt-16 bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Annex I</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                Which goods are covered by CBAM?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                CBAM currently covers six carbon-intensive sectors. The scope is expected to expand in future EU amendments.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS_PHOTOS.map((s) => (
                <li key={s.name} className="group relative overflow-hidden rounded-2xl shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} width={700} height={500} loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${s.accent}f0 0%, ${s.accent}aa 40%, transparent 68%)` }} />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">{s.codes}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xl font-bold text-white">{s.name}</p>
                    <p className="mt-1 text-sm text-white/75">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── WHO MUST COMPLY ── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Obligations</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                Who is subject to CBAM?
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { role: 'Importers', icon: '📦', desc: 'Any EU-established company importing CBAM goods above the de minimis threshold (>50 t/year).' },
                { role: 'Indirect importers', icon: '🔗', desc: 'Companies whose products contain CBAM goods even if they do not import directly.' },
                { role: 'Customs representatives', icon: '📋', desc: 'Indirect representatives may fulfil CBAM obligations on behalf of the importer.' },
                { role: 'Enterprise groups', icon: '🏢', desc: 'Groups with subsidiaries across multiple EU member states must consolidate CBAM reporting.' },
              ].map((item) => (
                <div key={item.role} className="rounded-xl border border-border p-6 hover:border-cobalt hover:shadow-md transition-all">
                  <span className="text-3xl">{item.icon}</span>
                  <p className="mt-4 font-bold text-navy">{item.role}</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#60a5fa]">Process</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                How CBAM compliance works
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.num} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="font-mono text-3xl font-bold text-[#60a5fa]">{step.num}</span>
                  <p className="mt-4 font-semibold text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Key dates</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                CBAM timeline &amp; deadlines
              </h2>
            </div>
            <ol className="relative border-l-2 border-border ml-4">
              {DEADLINES.map((d) => (
                <li key={d.date} className="mb-8 ml-8">
                  <div className={`absolute -left-[9px] mt-1 size-4 rounded-full border-2 ${d.done ? 'border-cobalt bg-cobalt' : 'border-border bg-white'}`} />
                  <span className={`mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${d.done ? 'bg-cobalt/10 text-cobalt' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {d.date}
                  </span>
                  <h3 className="font-bold text-navy mt-1">{d.label}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{d.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CALCULATOR ── */}
        <section id="calculator" className="scroll-mt-16 bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-sm font-semibold uppercase tracking-widest text-cobalt">Free tool</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                CBAM cost calculator
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
                Estimate your annual CBAM certificate cost based on your import volume, product type and country of origin.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
              {/* ETS ticker */}
              {etsPrice && (
                <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-navy">
                  <div>
                    <p className="text-xs text-blue-300 mb-0.5">Live EU ETS price</p>
                    <p className="text-2xl font-bold text-white">€{etsPrice.price.toFixed(2)} <span className="text-sm font-normal text-blue-300">/ tCO₂</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${etsPrice.isLive ? 'bg-green-400' : 'bg-yellow-400'}`}
                      style={etsPrice.isLive ? { animation: 'pulse 1.5s infinite' } : {}} />
                    <span className="text-xs text-blue-300">{etsPrice.isLive ? 'Live' : 'Reference price'}</span>
                  </div>
                </div>
              )}

              {/* Sector pills */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">1 — Sector</label>
                <div className="flex flex-wrap gap-2">
                  {CALC_SECTORS.map(s => (
                    <button key={s} onClick={() => handleSectorChange(s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${sector === s ? 'bg-navy text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {SECTOR_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">2 — Product</label>
                <select value={productId} onChange={e => { setProductId(e.target.value); setResult(null) }}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cobalt bg-white">
                  {sectorProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.emissionFactor} tCO₂/{p.unit} (CN {p.cnCode})</option>
                  ))}
                </select>
              </div>

              {/* Qty + country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    3 — Import quantity ({selectedProduct?.unit ?? 'tonne'})
                  </label>
                  <input type="number" min="0" value={quantity} onChange={e => { setQuantity(e.target.value); setResult(null) }}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cobalt" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">4 — Country of origin</label>
                  <select value={countryCode} onChange={e => { setCountryCode(e.target.value); setResult(null) }}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cobalt bg-white">
                    {ORIGIN_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name} {c.hasEts ? `(ETS: €${c.carbonPrice}/tCO₂)` : '(no carbon tax)'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom EF */}
              <div className="mb-5 p-3 bg-slate-50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={useCustomEf} onChange={e => setUseCustomEf(e.target.checked)} className="rounded" />
                  <span className="text-sm text-slate-600">Use actual embedded emissions (from supplier CBAM report)</span>
                </label>
                {useCustomEf && (
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" min="0" step="0.01" value={customEf} onChange={e => setCustomEf(e.target.value)}
                      placeholder={`Default: ${selectedProduct?.emissionFactor}`}
                      className="w-36 px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cobalt" />
                    <span className="text-sm text-slate-500">tCO₂ / {selectedProduct?.unit}</span>
                  </div>
                )}
              </div>

              <button onClick={() => {
                const qty = parseFloat(quantity)
                if (!qty || qty <= 0 || !etsPrice) return
                setResult(calcCbam(qty, ef, etsPrice.price, selectedCountry))
              }}
                disabled={!quantity || !etsPrice}
                className="w-full bg-cobalt text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1a4de0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {!etsPrice ? 'Loading ETS price...' : 'Calculate CBAM liability'}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-lg"
                style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.15s ease-out' }}
                onMouseMove={handleCardMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
                <div className="bg-gradient-to-r from-navy to-cobalt p-6 text-white">
                  <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Estimated CBAM Liability</p>
                  <div className="text-4xl font-bold tracking-tight">{formatEur(result.netCost)}</div>
                  <p className="text-blue-200 text-sm mt-1">net after {selectedCountry.name} carbon price deduction</p>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm mb-6">
                    <tbody className="divide-y divide-border">
                      <tr><td className="py-2 text-slate-500">Import quantity</td><td className="py-2 text-right font-medium">{parseFloat(quantity).toLocaleString('de-DE')} {selectedProduct?.unit}</td></tr>
                      <tr><td className="py-2 text-slate-500">Total embedded CO₂</td><td className="py-2 text-right font-medium">{result.grossEmissions.toFixed(1)} tCO₂</td></tr>
                      <tr><td className="py-2 text-slate-500">Gross CBAM cost</td><td className="py-2 text-right font-medium">{formatEur(result.grossCost)}</td></tr>
                      {result.countryDeduction > 0 && <tr><td className="py-2 text-green-600">− {selectedCountry.name} carbon price deduction</td><td className="py-2 text-right font-medium text-green-600">− {formatEur(result.countryDeduction)}</td></tr>}
                      <tr className="border-t-2 border-slate-300"><td className="py-3 font-bold text-slate-900">Net CBAM liability</td><td className="py-3 text-right font-bold text-navy text-lg">{formatEur(result.netCost)}</td></tr>
                    </tbody>
                  </table>
                  {bestSavings && bestSavings.cost < result.netCost * 0.9 && (
                    <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-green-700 text-sm font-medium">Procurement opportunity</p>
                      <p className="text-green-800 text-sm mt-1">Sourcing from <strong>{bestSavings.country.name}</strong> would reduce your CBAM cost to <strong>{formatEur(bestSavings.cost)}</strong>, saving <strong className="text-green-600">{formatEur(result.netCost - bestSavings.cost)}</strong></p>
                    </div>
                  )}
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/register" className="flex-1 text-center bg-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors">
                      Automate with Carbonis →
                    </Link>
                    <button onClick={() => setResult(null)} className="px-4 py-2.5 border border-border text-slate-600 rounded-lg text-sm hover:border-slate-300 transition-colors">
                      Recalculate
                    </button>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 text-center mt-6">
              Estimates based on EU Commission default values. Actual liability depends on verified embedded emissions. Not legal or tax advice.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-cobalt py-16">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Ready to automate your CBAM compliance?
            </h2>
            <p className="mt-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Carbonis handles emissions data collection, declaration filing and certificate management — for all 6 sectors, across all 27 EU member states.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-cobalt shadow hover:bg-slate-100 transition-colors">
                Start free trial
              </Link>
              <Link href="/marketplace" className="rounded-lg border px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                Visit carbon marketplace
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
