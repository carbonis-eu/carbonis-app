import { NextResponse } from 'next/server'

// Fallback values gCO2/kWh (2023 averages) — used when Ember API unavailable
const FALLBACK_INTENSITY: Record<string, number> = {
  CHN: 581, IND: 713, RUS: 342, TUR: 453, UKR: 289,
  USA: 367, CAN: 140, GBR: 178, CHE: 28, NOR: 19,
  JPN: 463, KOR: 415, BRA: 113, ZAF: 820, EGY: 452,
  VNM: 514, IDN: 762, MEX: 402, PAK: 349, TWN: 492,
  DEU: 385, FRA: 56, POL: 681, ITA: 331, ESP: 178,
}

const COUNTRY_TO_ISO3: Record<string, string> = {
  CN: 'CHN', IN: 'IND', RU: 'RUS', TR: 'TUR', UA: 'UKR',
  US: 'USA', CA: 'CAN', GB: 'GBR', CH: 'CHE', NO: 'NOR',
  JP: 'JPN', KR: 'KOR', BR: 'BRA', ZA: 'ZAF', EG: 'EGY',
  VN: 'VNM', ID: 'IDN', MX: 'MEX', PK: 'PAK', TW: 'TWN',
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const countryCode = searchParams.get('country') ?? 'CN'
  const iso3 = COUNTRY_TO_ISO3[countryCode] ?? countryCode

  const apiKey = process.env.EMBER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ intensity: FALLBACK_INTENSITY[iso3] ?? 500, source: 'fallback', isLive: false })
  }

  try {
    // Get last 3 months for recent average
    const end = new Date()
    const start = new Date(end)
    start.setMonth(start.getMonth() - 3)
    const startStr = start.toISOString().slice(0, 7)
    const endStr = end.toISOString().slice(0, 7)

    const url = `https://api.ember-energy.org/v1/carbon-intensity/monthly?entity_code=${iso3}&start_date=${startStr}&end_date=${endStr}&api_key=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) })

    if (res.ok) {
      const data = await res.json()
      const records: Array<{ emissions_intensity_gco2_per_kwh: number }> = data?.data ?? []
      if (records.length > 0) {
        const avg = records.reduce((s, r) => s + r.emissions_intensity_gco2_per_kwh, 0) / records.length
        return NextResponse.json({
          intensity: Math.round(avg),
          unit: 'gCO2/kWh',
          country: countryCode,
          source: 'Ember Energy (3-month avg)',
          isLive: true,
        })
      }
    }
  } catch { /* fallback */ }

  return NextResponse.json({
    intensity: FALLBACK_INTENSITY[iso3] ?? 500,
    unit: 'gCO2/kWh',
    country: countryCode,
    source: 'Ember Energy (fallback)',
    isLive: false,
  })
}
