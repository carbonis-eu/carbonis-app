import { createAdminClient } from '@/lib/supabase/admin'

const SEARCH_TARGETS = [
  {
    industry: 'avtoservis',
    query: 'avtoservis',
    cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper', 'Novo Mesto', 'Velenje', 'Ptuj', 'Murska Sobota'],
  },
  {
    industry: 'kozmetika',
    query: 'kozmetični salon',
    cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper'],
  },
  {
    industry: 'fitnes',
    query: 'fitnes studio',
    cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj'],
  },
  {
    industry: 'gostinstvo',
    query: 'restavracija',
    cities: ['Ljubljana', 'Maribor', 'Bled', 'Portorož', 'Piran', 'Celje'],
  },
  {
    industry: 'nepremicnine',
    query: 'nepremičninska agencija',
    cities: ['Ljubljana', 'Maribor', 'Koper', 'Kranj'],
  },
  {
    industry: 'ordinacija',
    query: 'zobozdravnik ordinacija',
    cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj'],
  },
]

interface PlacesResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  website?: string
}

interface PlaceDetails {
  formatted_phone_number?: string
  website?: string
  email?: string
}

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY!

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function textSearch(query: string, city: string): Promise<PlacesResult[]> {
  const q = encodeURIComponent(`${query} ${city} Slovenija`)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&region=si&language=sl&key=${MAPS_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Places textsearch failed: ${res.status}`)
  const data = await res.json() as { results: PlacesResult[]; status: string }
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API status: ${data.status}`)
  }
  return data.results ?? []
}

async function getDetails(placeId: string): Promise<PlaceDetails> {
  const fields = 'formatted_phone_number,website'
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${MAPS_KEY}`
  const res = await fetch(url)
  if (!res.ok) return {}
  const data = await res.json() as { result: PlaceDetails; status: string }
  return data.result ?? {}
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

          // Get phone + website via Details API
          await sleep(100)
          const details = await getDetails(place.place_id)

          const { error } = await db.from('prospects').insert({
            company_name: place.name,
            industry: target.industry,
            country: 'SI',
            city: extractCity(place.formatted_address),
            address: place.formatted_address,
            website: details.website ?? place.website ?? null,
            phone: details.formatted_phone_number ?? null,
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
