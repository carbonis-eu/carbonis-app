import { createAdminClient } from '@/lib/supabase/admin'

const SLO_CITIES = [
  'Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper', 'Novo Mesto',
  'Velenje', 'Ptuj', 'Murska Sobota', 'Nova Gorica', 'Jesenice',
  'Trbovlje', 'Slovenj Gradec', 'Kamnik', 'Domžale', 'Škofja Loka',
  'Izola', 'Postojna', 'Ravne na Koroškem', 'Brežice', 'Žalec',
  'Ajdovščina', 'Sežana', 'Ilirska Bistrica', 'Litija', 'Zagorje ob Savi',
  'Logatec', 'Kočevje', 'Črnomelj', 'Trebnje', 'Sevnica', 'Laško',
  'Ljutomer', 'Gornja Radgona', 'Ormož', 'Radlje ob Dravi', 'Šempeter pri Gorici',
]

const SEARCH_TARGETS = [
  {
    industry: 'avtoservis',
    query: 'avtoservis',
    cities: SLO_CITIES,
  },
  {
    industry: 'avtoservis',
    query: 'avtomehanik',
    cities: SLO_CITIES,
  },
  // Ostale branže — aktiviramo kasneje (uporabi SLO_CITIES):
  // { industry: 'kozmetika', query: 'kozmetični salon', cities: SLO_CITIES },
  // { industry: 'fitnes', query: 'fitnes studio', cities: SLO_CITIES },
  // { industry: 'gostinstvo', query: 'restavracija', cities: SLO_CITIES },
  // { industry: 'nepremicnine', query: 'nepremičninska agencija', cities: SLO_CITIES },
  // { industry: 'ordinacija', query: 'zobozdravnik ordinacija', cities: SLO_CITIES },
]

// Places API (New) response types
interface NewPlace {
  id: string
  displayName?: { text: string }
  formattedAddress?: string
  rating?: number
  userRatingCount?: number
  websiteUri?: string
  nationalPhoneNumber?: string
}

interface PlacesResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  website?: string
  phone?: string
}

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY!

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

// Scrape email from website — tries mailto: links first, then regex
async function scrapeEmail(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)' },
    })
    clearTimeout(timeout)
    if (!res.ok) return null

    const html = await res.text()

    // 1. mailto: links (most reliable)
    const mailtoMatch = html.match(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i)
    if (mailtoMatch) return mailtoMatch[1].toLowerCase()

    // 2. Generic email pattern in HTML
    const emailMatch = html.match(/\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/g)
    if (emailMatch) {
      // Filter out common false positives
      const skip = ['@example.com', '@sentry.io', '@google.com', '@facebook.com', '@schema.org', '@w3.org', '.png', '.jpg', '.gif', '.svg', '.woff']
      const valid = emailMatch.find(e => !skip.some(s => e.includes(s)))
      if (valid) return valid.toLowerCase()
    }

    return null
  } catch {
    return null
  }
}

// Uses Places API (New) — POST /v1/places:searchText
async function textSearch(query: string, city: string): Promise<PlacesResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': MAPS_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber',
    },
    body: JSON.stringify({
      textQuery: `${query} ${city} Slovenija`,
      languageCode: 'sl',
      regionCode: 'SI',
      maxResultCount: 20,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Places API (New) failed: ${res.status} — ${err}`)
  }

  const data = await res.json() as { places?: NewPlace[] }
  return (data.places ?? []).map(p => ({
    place_id: p.id,
    name: p.displayName?.text ?? '',
    formatted_address: p.formattedAddress ?? '',
    rating: p.rating,
    user_ratings_total: p.userRatingCount,
    website: p.websiteUri,
    phone: p.nationalPhoneNumber,
  }))
}

function extractCity(address: string): string {
  // "Dunajska cesta 5, 1000 Ljubljana, Slovenija" → "Ljubljana"
  const parts = address.split(',')
  if (parts.length >= 2) {
    const middle = parts[parts.length - 2].trim()
    return middle.replace(/^\d+\s*/, '').trim()
  }
  return address
}

export async function searchProspects(maxPerRun = 100): Promise<{ found: number; inserted: number }> {
  const db = createAdminClient()
  let totalFound = 0
  let totalInserted = 0

  for (const target of SEARCH_TARGETS) {
    for (const city of target.cities) {
      if (totalInserted >= maxPerRun) break
      try {
        await sleep(200) // ~5 req/sec — under Google's limit
        const results = await textSearch(target.query, city)
        totalFound += results.length

        for (const place of results) {
          if (totalInserted >= maxPerRun) break

          // Skip if already in DB
          const { data: existing } = await db
            .from('prospects')
            .select('id')
            .eq('google_place_id', place.place_id)
            .maybeSingle()
          if (existing) continue

          // Try to get email from website
          let email: string | null = null
          if (place.website) {
            await sleep(500)
            email = await scrapeEmail(place.website)
          }

          const { error } = await db.from('prospects').insert({
            company_name: place.name,
            industry: target.industry,
            country: 'SI',
            city: city,
            address: place.formatted_address,
            website: place.website ?? null,
            phone: place.phone ?? null,
            email: email,
            google_place_id: place.place_id,
            google_rating: place.rating ?? null,
            google_reviews_count: place.user_ratings_total ?? 0,
            source: 'google_maps',
            status: 'new',
          })

          if (error) {
            console.error(`[m8-search] insert error for ${place.name}:`, error.message)
            await db.from('m8_error_logs').insert({
              step: 'search',
              error: error.message,
              context: { place_id: place.place_id, name: place.name },
            })
          } else {
            totalInserted++
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`[m8-search] ${target.industry}/${city}:`, msg)
        await db.from('m8_error_logs').insert({
          step: 'search',
          error: msg,
          context: { industry: target.industry, city },
        })
      }
    }
    if (totalInserted >= maxPerRun) break
  }

  console.log(`[m8-search] found=${totalFound} inserted=${totalInserted}`)
  return { found: totalFound, inserted: totalInserted }
}
