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

const CALC_SECTORS: CbamSector[] = ['steel', 'cement', 'aluminum', 'fertilizers', 'hydrogen', 'electricity']

export default function CbamCalculatorSection() {
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

          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">2 — Product</label>
            <select value={productId} onChange={e => { setProductId(e.target.value); setResult(null) }}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cobalt bg-white">
              {sectorProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.emissionFactor} tCO₂/{p.unit} (CN {p.cnCode})</option>
              ))}
            </select>
          </div>

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
  )
}
