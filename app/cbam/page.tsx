'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  CBAM_PRODUCTS,
  ORIGIN_COUNTRIES,
  SECTOR_LABELS,
  type CbamSector,
  type CbamProduct,
  type OriginCountry,
} from '@/lib/cbam/data'

interface EtsPrice {
  price: number
  isLive: boolean
  source: string
}

interface CalcResult {
  grossEmissions: number
  countryCredit: number
  netEmissions: number
  grossCost: number
  countryDeduction: number
  netCost: number
  etsPrice: number
}

function formatEur(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function calcCbam(qty: number, ef: number, etsPrice: number, country: OriginCountry): CalcResult {
  const grossEmissions = qty * ef
  const countryCredit = Math.min(country.carbonPrice, etsPrice)
  const netEmissions = grossEmissions
  const grossCost = grossEmissions * etsPrice
  const countryDeduction = grossEmissions * countryCredit
  const netCost = Math.max(0, grossCost - countryDeduction)
  return { grossEmissions, countryCredit, netEmissions, grossCost, countryDeduction, netCost, etsPrice }
}

const SECTORS: CbamSector[] = ['steel', 'cement', 'aluminum', 'fertilizers', 'hydrogen', 'electricity']

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

  function handleCalculate() {
    const qty = parseFloat(quantity)
    if (!qty || qty <= 0 || !etsPrice) return
    setResult(calcCbam(qty, ef, etsPrice.price, selectedCountry))
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
    <div className="min-h-screen bg-[#FFFBF3]">
      <style>{`
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        }
        .card-3d:hover {
          box-shadow: 0 24px 60px rgba(11,36,113,0.18), 0 4px 16px rgba(38,92,255,0.12);
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-count { animation: countUp 0.4s ease-out both; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .live-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold text-[#0B2471]">Carbonis</Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title + ETS ticker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CBAM Cost Calculator</h1>
            <p className="text-gray-500 text-sm mt-1">EU Regulation 2023/956 — estimate your carbon border adjustment liability</p>
          </div>
          {etsPrice && (
            <div className="bg-[#0B2471] text-white rounded-xl px-4 py-3 min-w-[180px] text-right">
              <div className="flex items-center justify-end gap-1.5 mb-0.5">
                <span className={`w-2 h-2 rounded-full ${etsPrice.isLive ? 'bg-green-400 live-dot' : 'bg-yellow-400'}`} />
                <span className="text-xs text-blue-300">{etsPrice.isLive ? 'Live' : 'Indicative'}</span>
              </div>
              <div className="text-xl font-bold">€{etsPrice.price.toFixed(2)}</div>
              <div className="text-xs text-blue-300">EU ETS / tCO₂</div>
            </div>
          )}
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          {/* Sector pills */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">1 — Select sector</label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSectorChange(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    sector === s
                      ? 'bg-[#0B2471] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {SECTOR_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Product select */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">2 — Product</label>
            <select
              value={productId}
              onChange={e => { setProductId(e.target.value); setResult(null) }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF] bg-white"
            >
              {sectorProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.emissionFactor} tCO₂/{p.unit} (CN {p.cnCode})
                </option>
              ))}
            </select>
            {selectedProduct?.note && (
              <p className="text-xs text-gray-400 mt-1">{selectedProduct.note}</p>
            )}
          </div>

          {/* Quantity + country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                3 — Import quantity ({selectedProduct?.unit ?? 'tonne'})
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={e => { setQuantity(e.target.value); setResult(null) }}
                placeholder="e.g. 500"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">4 — Country of origin</label>
              <select
                value={countryCode}
                onChange={e => { setCountryCode(e.target.value); setResult(null) }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF] bg-white"
              >
                {ORIGIN_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name} {c.hasEts ? `(ETS: €${c.carbonPrice}/tCO₂)` : '(no carbon tax)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom emission factor toggle */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomEf}
                onChange={e => setUseCustomEf(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Use actual embedded emissions (from production data / CBAM report)</span>
            </label>
            {useCustomEf && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customEf}
                  onChange={e => setCustomEf(e.target.value)}
                  placeholder={`Default: ${selectedProduct?.emissionFactor}`}
                  className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
                />
                <span className="text-sm text-gray-500">tCO₂ / {selectedProduct?.unit}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={!quantity || !etsPrice}
            className="w-full bg-[#265CFF] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1a4de0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!etsPrice ? 'Loading ETS price...' : 'Calculate CBAM liability'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            className="card-3d bg-white rounded-2xl border border-gray-200 overflow-hidden"
            style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            onMouseMove={handleCardMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            {/* Result header */}
            <div className="bg-gradient-to-r from-[#0B2471] to-[#265CFF] p-6 text-white">
              <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Estimated CBAM Liability</p>
              <div className="animate-count text-4xl font-bold tracking-tight">{formatEur(result.netCost)}</div>
              <p className="text-blue-200 text-sm mt-1">
                net after {selectedCountry.name} carbon price deduction (€{result.countryCredit}/tCO₂)
              </p>
            </div>

            {/* Breakdown */}
            <div className="p-6">
              <table className="w-full text-sm mb-6">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 text-gray-500">Import quantity</td>
                    <td className="py-2 text-right font-medium">{parseFloat(quantity).toLocaleString('de-DE')} {selectedProduct?.unit}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">Emission factor</td>
                    <td className="py-2 text-right font-medium">{ef} tCO₂ / {selectedProduct?.unit}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">Total embedded CO₂</td>
                    <td className="py-2 text-right font-medium">{result.grossEmissions.toFixed(1)} tCO₂</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">EU ETS price</td>
                    <td className="py-2 text-right font-medium">€{result.etsPrice.toFixed(2)} / tCO₂</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">Gross CBAM cost</td>
                    <td className="py-2 text-right font-medium">{formatEur(result.grossCost)}</td>
                  </tr>
                  {result.countryDeduction > 0 && (
                    <tr>
                      <td className="py-2 text-green-600">− Carbon price paid ({selectedCountry.name})</td>
                      <td className="py-2 text-right font-medium text-green-600">− {formatEur(result.countryDeduction)}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-3 font-bold text-gray-900">Net CBAM liability</td>
                    <td className="py-3 text-right font-bold text-[#0B2471] text-lg">{formatEur(result.netCost)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Risk indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
                </div>
                <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#0B2471] shadow"
                    style={{ left: `${Math.min(95, Math.min(result.netCost / (result.grossCost || 1) * 100, 95))}%` }}
                  />
                </div>
              </div>

              {/* Savings opportunity */}
              {bestSavings && bestSavings.cost < result.netCost * 0.9 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 text-sm font-medium mb-1">Procurement opportunity</p>
                  <p className="text-green-800 text-sm">
                    Sourcing from <strong>{bestSavings.country.name}</strong> would reduce your CBAM cost to{' '}
                    <strong>{formatEur(bestSavings.cost)}</strong>, saving{' '}
                    <strong className="text-green-600">{formatEur(result.netCost - bestSavings.cost)}</strong>
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link
                  href="/register"
                  className="flex-1 text-center bg-[#0B2471] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a1f63] transition-colors"
                >
                  Generate CBAM declaration →
                </Link>
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:border-gray-300 transition-colors"
                >
                  Recalculate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legal note */}
        <p className="text-xs text-gray-400 text-center mt-8">
          Estimates based on EU Regulation 2023/956 default values. Actual CBAM liability depends on verified embedded emissions and declarant data.
          Not legal or tax advice.
        </p>
      </main>
    </div>
  )
}
