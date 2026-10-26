import { NextResponse } from 'next/server'

const FALLBACK_PRICE = 65.40 // EU ETS indicative price €/tCO2

export async function GET() {
  // Try Yahoo Finance for EUA futures (C02Z24.EX)
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/EUA%3DF?interval=1d&range=5d',
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    if (res.ok) {
      const data = await res.json()
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
      if (typeof price === 'number' && price > 10 && price < 300) {
        return NextResponse.json({
          price: Math.round(price * 100) / 100,
          currency: 'EUR',
          unit: 'tCO2',
          source: 'ICE ECX via Yahoo Finance',
          isLive: true,
          timestamp: new Date().toISOString(),
        })
      }
    }
  } catch {
    // fallthrough to static
  }

  return NextResponse.json({
    price: FALLBACK_PRICE,
    currency: 'EUR',
    unit: 'tCO2',
    source: 'ICE ECX (indicative)',
    isLive: false,
    timestamp: new Date().toISOString(),
  })
}
