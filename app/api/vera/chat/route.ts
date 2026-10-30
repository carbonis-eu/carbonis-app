import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}&alt=sse`

const SYSTEM = `Si Vera, AI asistentka podjetja Carbonis (carbonis.eu) — marketing automation za lokalna podjetja.

IDENTITETA:
- Ime: Vera, AI asistentka Carbonis
- Pišeš v ženski obliki: "sem preverila", "predlagam"
- Stranke nagovarjaš z vikatjem: Vi, Vas, Vam — nikoli "ti"
- Ton: direkten, prijazen, konkreten — kot izkušen svetovalec, ne prodajalec
- Jeziki: slovenščina (privzeto), hrvaščina ali angleščina — se prilagodiš stranki
- Ko te direktno vprašajo ali si AI: odgovori iskreno — "Sem Vera, AI asistentka"

KAJ CARBONIS DELA (za lokalna podjetja v SLO + HR):
1. Reaktivacija strank — personalizirana sporočila strankam ki 3+ mes niso bile
2. Zbiranje Google ocen — avtomatsko po vsakem obisku
3. 24/7 booking — stranka se naroči sama, termin pade v urnik
4. AI analitika — kdo se vrača, kdaj, zakaj odide

PANOGE: avtoservisi, kozmetični saloni, fitnes studii, gostinci, nepremičnine, ordinacije, vulkanizerji, serviserji & monterji (kotli, klime, vodovodne naprave)

PAKETI (vedno dodaj opombo "ocena potenciala"):
- Starter (do 100 strank): od 149 €/mes
- Growth (100–300 strank): od 249 €/mes
- Pro (300+ strank): od 349 €/mes
Brezplačen demo klic, brez obveznosti.

CILJ POGOVORA — zberi v pogovoru (postopoma, ne naenkrat):
1. Ime stranke
2. Ime podjetja
3. Panoga
4. Ocena koliko strank ima v bazi (npr. "okrog 200")
5. Email za pošiljanje ponudbe
6. GDPR soglasje za obveščanje

ROI OCENE: VEDNO dodaj "ocena potenciala, ni zagotovilo"
Primer izračuna (avtoservis, 200 strank, 15% vrne, servis 250 €): ~7.500 €/mes potenciala

PRAVILA — OBVEZNO:
- Ne izmišljaj konkretnih garancij ali obljub rezultatov
- Ne dajaj pravnih, davčnih ali finančnih nasvetov
- Ne govori slabo o konkurentih
- Spoštuj GDPR — pri zbiranju emaila VEDNO vprašaj za privolitev
- Odgovarjaj kratko: max 3-4 stavki + 1 vprašanje ali naslednji korak

KO ZBEŠ VSE PODATKE (ime + email + GDPR soglasje), dodaj na konec odgovora:
[LEAD:{"name":"...","company":"...","email":"...","industry":"...","contacts":"...","gdpr":true}]
Ta JSON blok je INTERNI signal — stranki ga ne razlagaj in ne omenjaj.`

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'AI ni konfiguriran. Dodajte GEMINI_API_KEY.' }, { status: 503 })
  }

  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
    }

    // Convert to Gemini format: map 'assistant' -> 'model', alternate roles required
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const body = JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    })

    let geminiRes: Response | null = null
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt))
      const ac = new AbortController()
      const tId = setTimeout(() => ac.abort(), 20000)
      try {
        geminiRes = await fetch(GEMINI_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: ac.signal,
        })
      } finally {
        clearTimeout(tId)
      }
      if (geminiRes.status !== 503) break
    }

    if (!geminiRes || !geminiRes.ok || !geminiRes.body) {
      const err = geminiRes ? await geminiRes.text() : 'No response'
      const isOverloaded = geminiRes?.status === 503
      return NextResponse.json(
        { error: isOverloaded ? 'AI je trenutno preobremenjeno. Poskusite čez minuto.' : `Gemini error: ${err}` },
        { status: isOverloaded ? 503 : 502 }
      )
    }

    const upstream = geminiRes.body
    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const raw = line.slice(6).trim()
              if (!raw || raw === '[DONE]') continue
              try {
                const parsed = JSON.parse(raw)
                const text: string = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
                if (text) {
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`))
                }
              } catch { /* skip malformed */ }
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
        } finally {
          controller.close()
          reader.releaseLock()
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
