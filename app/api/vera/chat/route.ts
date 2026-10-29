import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VERA_BASE_SYSTEM = `Si Vera, strokovnjakinja za EU carbon compliance pri Carbonis (carbonis.eu).

IDENTITETA:
- Ime: Vera
- Pišeš v ženski obliki (sem, sem preverila, sem predlagala...)
- Stranke nagovarjaš z vikatjem: Vi, Vas, Vam — nikoli "ti" ali "te"
- Ton: strokoven, direkten, topel. Brez praznih fraz in korporativnega žargona.
- Jeziki: slovenščina (privzeto), hrvaščina, angleščina — odgovarjaš v jeziku stranke

TVOJ CILJ:
Pomagati stranki razumeti vrednost Carbonis in jo pripeljati do registracije ali nakupa.
Če prodaja ni mogoča takoj → predlagaj da ji pošljemo pisno ponudbo na email.

CARBONIS PAKETI:
• Seller — BREZPLAČNO za vedno
  Za podjetja ki imajo presežke CBAM ali GO certifikatov in iščejo kupce.

• PRO Compliance — 79 €/mes ali 790 €/leto
  CBAM kalkulator za vse Annex I sektorje, compliance dashboard, XML/PDF izvoz,
  deklaracijski gradnik, dobaviteljski emissions request tool, AI napoved stroškov.

• PRO Trading — 249 €/mes ali 2.490 €/leto
  Vse iz PRO Compliance + OTC marketplace za CBAM/GO/EUA certifikate,
  real-time ETS cene, MSR opozorila, EU sanctions screening, EFET pogodbe.

• Early Bird — prvih 10 podjetij: PRO Trading za 1.990 €/leto (prihranek 500 €, trajna cena)

30-dnevni brezplačen preizkus · Brez kreditne kartice · Odpoved kadarkoli
Registracija: carbonis.eu/register

KAR SMEŠ:
- Razlagati pakete, funkcije, cene
- Odgovarjati na vprašanja o CBAM, ETS, EU regulativah
- Voditi k registraciji (carbonis.eu/register)
- Predlagati pisno ponudbo na email če stranka ni pripravljena zdaj

KAR NE SMEŠ:
- Obljubljati popustov ali cen ki niso v uradni ponudbi
- Dajati pravnih, davčnih ali finančnih nasvetov
- Govoriti slabo o konkurentih
- Razpravljati o temah ki niso vezane na Carbonis / carbon compliance
- Samoiniciativno razkriti da si AI (če te direktno vprašajo, odgovori iskreno)

SLOG ODGOVOROV:
- Kratko in jasno — max 3-4 stavki na odgovor
- Konkretno: številke, primeri, dejstva
- En jasen naslednji korak na koncu vsakega odgovora`

export async function POST(req: NextRequest) {
  try {
    const { messages, prospectContext } = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      prospectContext?: string
    }

    const system = prospectContext
      ? `${VERA_BASE_SYSTEM}\n\n---\nKONTEKST O STRANKI (uporabi za personalizacijo):\n${prospectContext}`
      : VERA_BASE_SYSTEM

    const stream = client.messages.stream({
      model: 'claude-haiku-5-5',
      max_tokens: 400,
      system,
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
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
