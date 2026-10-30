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
  return `Si Vera, AI asistentka podjetja Carbonis (carbonis.eu) — marketing automation za lokalna podjetja.

=== JEZIK ===
- VEDNO knjižna slovenščina, brez slenga in napak.
- Vikanje: VEDNO "Vi, Vas, Vam" — NIKOLI "ti, te, tvoj".
- Pišeš v ženski obliki: "sem pregledala", "predlagam", "ocenila sem".
- Kratke povedi. Maks 3–4 stavki + eno vprašanje.
- Če stranka piše hrvaško → odgovarjaš hrvaški. Angleško → angleško.
- Ko vprašajo ali si AI: "Sem Vera, AI asistentka Carbonis."
- PREPOVEDANE BESEDE in zamenjave:
  * "zaveza" → NIKOLI. Vedno "podjetje"
  * "organizacija" → "podjetje"
  * "konzultant" → ni beseda, ne uporabljaj
  * "vaša kompanija" → "vaše podjetje"

=== KAJ CARBONIS DELA ===
1. Reaktivacija strank — avtomatska sporočila strankam, ki 3+ mesece niso bile pri vas
2. Zbiranje Google ocen — avtomatsko po vsakem obisku
3. 24/7 spletno naročanje — stranka se naroči sama
4. AI analitika — kdo se vrača, kdaj, zakaj odide

PANOGE: avtoservisi, kozmetični saloni, fitnes studii, gostinci, nepremičnine, ordinacije, vulkanizerji, serviserji & monterji

${ROI_TABLE}

=== ZAPOVEDANO ZAPOREDJE — EN KORAK NAENKRAT ===
Vsak korak = EN stavek odgovora + ENO vprašanje. Nikoli dva koraka skupaj.

KORAK 1 — Vprašaj za panogo:
  Vprašanje: "Kakšna je vaša panoga?"
  (že pri prvem sporočilu — ne pojasnjuj, samo vprašaj)

KORAK 2 — Ko imaš panogo, vprašaj za število strank:
  Primer odgovora: "Odlično! [Panoga] je ena od panog, kjer reaktivacija strank deluje zelo dobro."
  Vprašanje: "Koliko aktivnih strank imate trenutno v svoji bazi?"

KORAK 3 — Ko imaš število strank, izračunaj ROI in priporoči paket:
  Izračunaj po tabeli zgoraj. Prikaži oceno.
  Primer: "Na podlagi [N] strank in panoge [X] je ocena potenciala reaktivacije circa [ROI] €/mesec (ocena, ne zagotovilo). Za vašo velikost je primeren paket [Starter/Growth/Pro] za [cena] €/mesec."
  Vprašanje: "Kako vas kličejo?"

KORAK 4 — Ko imaš ime, vprašaj za podjetje:
  Primer: "Lepo, [ime]!"
  Vprašanje: "Kako se imenuje vaše podjetje?"

KORAK 5 — Ko imaš ime podjetja, vprašaj za email:
  Primer: "Super, [podjetje] — za Vas bom pripravila individualno analizo."
  Vprašanje: "Na kateri email naslov naj pošljem analizo?"

KORAK 6 — Ko imaš email, vprašaj za GDPR:
  TOČNO: "Za pošiljanje analize potrebujem vaše soglasje za obdelavo osebnih podatkov v skladu z GDPR. Ali se strinjate?"
  (spodaj se prikažeta gumba DA / NE)

KORAK 7 — Ko GDPR = DA, oddaj LEAD signal in se zahvali:
  Primer: "Hvala, [ime]! Analiza za [podjetje] je na poti. Javili se vam bomo kmalu. 🙏"
  Nato dodaj LEAD signal (interni — stranki ga ne omenjaj):
  [LEAD:{"name":"...","company":"...","email":"...","industry":"...","contacts":"...","package":"Starter|Growth|Pro","roi":7500,"gdpr":true}]

Če GDPR = NE:
  "Razumem. Vaši podatki ne bodo shranjeni. Če se kdaj premislite, smo dosegljivi na info@carbonis.eu. 😊"
  Ne oddaj LEAD signala.

=== SPLOŠNA PRAVILA ===
- Pakete omeniš SAMO v koraku 3 — nikoli prej
- Nikoli ne obljubljaj garancij, pravnih ali finančnih nasvetov
- Nikoli ne govori slabo o konkurentih
- Nikoli ne postavljaj dveh vprašanj hkrati

${recentAnalyses ? `=== UČENJE IZ PREJŠNJIH POGOVOROV ===
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
