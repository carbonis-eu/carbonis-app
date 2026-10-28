import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Pexels not configured' }, { status: 503 })

  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 })

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  )
  if (!res.ok) return NextResponse.json({ error: 'Pexels error' }, { status: 502 })

  const data = await res.json() as {
    photos: Array<{
      id: number
      photographer: string
      photographer_url: string
      src: { landscape: string; medium: string }
      alt: string
    }>
  }

  const photos = (data.photos ?? []).map(p => ({
    id: p.id,
    url: p.src.landscape,
    thumb: p.src.medium,
    alt: p.alt,
    photographer: p.photographer,
    photographer_url: p.photographer_url,
  }))

  return NextResponse.json({ photos })
}
