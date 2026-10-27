'use client'

import { useState, useEffect } from 'react'
import { CBAM_PRODUCTS, ORIGIN_COUNTRIES, type CbamSector } from '@/lib/cbam/data'
import Link from 'next/link'

const SECTORS: { value: CbamSector; label: string }[] = [
  { value: 'steel', label: 'Iron & Steel' },
  { value: 'cement', label: 'Cement' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'fertilizers', label: 'Fertilizers' },
  { value: 'hydrogen', label: 'Hydrogen' },
  { value: 'electricity', label: 'Electricity' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

export default function InlineCbamCalc({ etsPrice }: { etsPrice: number }) {
  const [sector, setSector] = useState<CbamSector>('steel')
  const [productId, setProductId] = useState('steel-crude-bof')
  const [qty, setQty] = useState('')
  const [countryCode, setCountryCode] = useState('CN')

  const products = CBAM_PRODUCTS.filter(p => p.sector === sector)
  const product = CBAM_PRODUCTS.find(p => p.id === productId) ?? products[0]
  const country = ORIGIN_COUNTRIES.find(c => c.code === countryCode)!

  useEffect(() => {
    const first = CBAM_PRODUCTS.find(p => p.sector === sector)
    if (first) setProductId(first.id)
  }, [sector])

  const quantity = parseFloat(qty) || 0
  const emissions = quantity * (product?.emissionFactor ?? 0)
  const gross = emissions * etsPrice
  const deduction = emissions * Math.min(country.carbonPrice, etsPrice)
  const net = Math.max(0, gross - deduction)
  const hasResult = quantity > 0

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0B2471] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">CBAM Liability Estimator</p>
          <p className="text-blue-300 text-xs mt-0.5">EU Regulation 2023/956</p>
        </div>
        <div className="text-right">
          <p className="text-blue-300 text-xs">EU ETS</p>
          <p className="text-white font-bold">€{etsPrice.toFixed(2)}<span className="text-blue-300 text-xs font-normal">/tCO₂</span></p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Sector */}
        <div className="grid grid-cols-3 gap-1.5">
          {SECTORS.map(s => (
            <button
              key={s.value}
              onClick={() => setSector(s.value)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                sector === s.value
                  ? 'bg-[#0B2471] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Product */}
        <select
          value={productId}
          onChange={e => setProductId(e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#265CFF] bg-white"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.emissionFactor} tCO₂/{p.unit})</option>
          ))}
        </select>

        {/* Quantity + Country */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Quantity ({product?.unit ?? 't'})</label>
            <input
              type="number"
              min="0"
              value={qty}
              onChange={e => setQty(e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Origin country</label>
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF] bg-white"
            >
              {ORIGIN_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className={`rounded-xl border transition-all duration-300 ${hasResult ? 'border-[#265CFF]/20 bg-blue-50/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="p-4">
            <p className="text-xs text-slate-500 mb-1">Estimated CBAM liability</p>
            <p className={`text-3xl font-bold transition-all ${hasResult ? 'text-[#0B2471]' : 'text-slate-300'}`}>
              {hasResult ? fmt(net) : '€ —'}
            </p>
            {hasResult && (
              <div className="mt-3 space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>{emissions.toFixed(1)} tCO₂ × €{etsPrice.toFixed(2)}</span>
                  <span>{fmt(gross)}</span>
                </div>
                {deduction > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>− {country.name} carbon credit (€{country.carbonPrice}/tCO₂)</span>
                    <span>− {fmt(deduction)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Link
          href="/register"
          className="block w-full text-center bg-[#265CFF] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1a4de0] transition-colors"
        >
          Get full CBAM declaration →
        </Link>
        <p className="text-center text-xs text-slate-400">Free 30-day trial · No credit card</p>
        <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3 mt-1">
          * Carbon prices shown are indicative estimates based on publicly available market data. Actual CBAM certificate prices are set weekly by the European Commission based on the EU ETS auction price average.{' '}
          <a href="https://cbam.ec.europa.eu" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Verify at the EU CBAM Registry.</a>
        </p>
      </div>
    </div>
  )
}
