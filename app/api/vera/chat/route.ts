import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

PANOGE: avtoservisi, kozmetični saloni, fitnes studii, gostinci, nepremičnine, ordinacije

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
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI ni konfiguriran. Dodajte ANTHROPIC_API_KEY.' }, { status: 503 })
  }

  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
    }

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: SYSTEM,
      messages,
    })

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const data = JSON.stringify({ text: chunk.delta.text })
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
        } finally {
          controller.close()
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
