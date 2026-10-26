import { NextResponse } from 'next/server'

const FALLBACK_PRICE = 65.40

// Try multiple free sources for EU ETS spot price
async function fetchEtsPrice(): Promise<{ price: number; source: string } | null> {
  // Source 1: Yahoo Finance EUA=F futures
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/EUA%3DF?interval=1d&range=5d',
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' }, signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const data = await res.json()
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
      if (typeof price === 'number' && price > 10 && price < 300) {
        return { price: Math.round(price * 100) / 100, source: 'ICE ECX via Yahoo Finance' }
      }
    }
  } catch { /* try next */ }

  // Source 2: Yahoo Finance C02 futures (EEX EUA)
  try {
    const res = await fetch(
      'https://query2.finance.yahoo.com/v8/finance/chart/C02%3DF?interval=1d&range=2d',
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' }, signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const data = await res.json()
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
      if (typeof price === 'number' && price > 10 && price < 300) {
        return { price: Math.round(price * 100) / 100, source: 'EEX EUA via Yahoo Finance' }
      }
    }
  } catch { /* fallback */ }

  return null
}

export async function GET() {
  const live = await fetchEtsPrice()

  if (live) {
    return NextResponse.json({
      price: live.price,
      currency: 'EUR',
      unit: 'tCO2',
      source: live.source,
      isLive: true,
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    price: FALLBACK_PRICE,
    currency: 'EUR',
    unit: 'tCO2',
    source: 'ICE ECX (indicative — cached)',
    isLive: false,
    timestamp: new Date().toISOString(),
  })
}
