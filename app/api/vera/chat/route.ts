import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen/qwen3.8-27b'

const ROI_TABLE = `
ROI KALKULACIJA (vedno označi z "ocena potenciala, ni zagotovilo"):
- Avtoservis: stranke × 15% × 250€ = X €/mes
- Kozmetika/salon: stranke × 25% × 60€ = X €/mes
- Fitnes studio: stranke × 20% × 50€ = X €/mes
- Gostinstvo: stranke × 30% × 40€ = X €/mes
- Nepremičnine: stranke × 10% × 2.000€ = X €/mes
- Ordinacija: stranke × 20% × 80€ = X €/mes
- Vulkanizerji: stranke × 60% × 60€ × 2 sezoni / 12 = X €/mes
- Serviserji & monterji: stranke × 40% × 120€ = X €/mes

PAKET glede na število strank:
- do 100: Starter (149€/mes)
- 100–300: Growth (249€/mes)
- 300+: Pro (349€/mes)`

function buildSystem(recentAnalyses: string): string {
  return `Si Vera, AI asistentka podjetja Carbonis (carbonis.eu) — marketing automation za lokalna podjetja v SLO in HR.

IDENTITETA:
- Pišeš v ženski obliki: "sem preverila", "predlagam"
- Vikanje: Vi, Vas, Vam — nikoli "ti"
- Ton: direkten, prijazen, konkreten — ne prodajalka, ampak svetovalka
- Jeziki: slovenščina privzeto, se prilagodiš (HR, EN)
- Ko vprašajo ali si AI: "Sem Vera, AI asistentka Carbonis"

KAJ CARBONIS DELA:
1. Reaktivacija strank — avtomatska sporočila strankam ki 3+ mes niso bile
2. Zbiranje Google ocen — po vsakem obisku
3. 24/7 booking — stranka se naroči sama
4. AI analitika — kdo se vrača, kdaj, zakaj odide

PANOGE: avtoservisi, kozmetični saloni, fitnes studii, gostinci, nepremičnine, ordinacije, vulkanizerji, serviserji & monterji

${ROI_TABLE}

STRIKT FUNNEL — TOČNO V TEM VRSTNEM REDU, en korak naenkrat:
1. Vprašaj za panogo → čakaj odgovor
2. Vprašaj za število strank v bazi → čakaj odgovor
3. Izračunaj ROI po zgornji tabeli → pokaži oceno stranki (z opombo "ocena potenciala")
4. Vprašaj za ime stranke → čakaj odgovor
5. Vprašaj za ime podjetja → čakaj odgovor
6. Vprašaj za email naslov → čakaj odgovor
7. Vprašaj za GDPR privolitev → čakaj odgovor
→ Ko imaš VSE: oddaj [LEAD:...] signal (samo enkrat, na koncu)

PRAVILA:
- En korak naenkrat — nikoli ne postavljaj dveh vprašanj hkrati
- Pakete omeniš SAMO v koraku 3 (ROI ocena) — nikoli prej, nikoli posebej
- Ne izmišljaj garancij, pravnih ali finančnih nasvetov
- Ne govori slabo o konkurentih
- Odgovori max 3-4 stavki + 1 vprašanje

KO ZBEŠ VSE PODATKE, dodaj na konec:
[LEAD:{"name":"...","company":"...","email":"...","industry":"...","contacts":"...","package":"Starter|Growth|Pro","roi":7500,"gdpr":true}]
Ta signal je interni — stranki ga ne omenjaj.

${recentAnalyses ? `UČENJE IZ PREJŠNJIH POGOVOROV (upoštevaj pri tem pogovoru):
${recentAnalyses}` : ''}`
}

async function getRecentAnalyses(): Promise<string> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('vera_session_logs')
      .select('what_went_well, what_to_improve, overall_rating')
      .order('created_at', { ascending: false })
      .limit(3)

    if (!data || data.length === 0) return ''

    return data.map((a, i) =>
      `Analiza ${i + 1} (ocena ${a.overall_rating}/5):\n+ ${a.what_went_well}\n− ${a.what_to_improve}`
    ).join('\n\n')
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'AI ni konfiguriran.' }, { status: 503 })
  }

  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
    }

    const recentAnalyses = await getRecentAnalyses()
    const system = buildSystem(recentAnalyses)

    const ac = new AbortController()
    const tId = setTimeout(() => ac.abort(), 22000)

    let groqRes: Response
    try {
      groqRes = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: system },
            ...messages.map(m => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 512,
          temperature: 0.65,
        }),
        signal: ac.signal,
      })
    } finally {
      clearTimeout(tId)
    }

    if (!groqRes.ok) {
      const err = await groqRes.text()
      return NextResponse.json(
        { error: groqRes.status === 429 ? 'AI je trenutno zaseden — poskusite čez minuto.' : `Napaka: ${err}` },
        { status: groqRes.status === 429 ? 503 : 502 }
      )
    }

    const data = await groqRes.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const text = data?.choices?.[0]?.message?.content ?? ''
    if (!text) {
      return NextResponse.json({ error: 'Praznen odgovor — poskusite znova.' }, { status: 502 })
    }

    return NextResponse.json({ text })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const isAbort = msg.toLowerCase().includes('abort')
    return NextResponse.json(
      { error: isAbort ? 'Zahteva je potekla — poskusite znova.' : msg },
      { status: 500 }
    )
  }
}
