import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen/qwen3.8-27b'

interface SalesContext {
  panoga: string
  contacts: string
  roi: number
  pkg: string
  price: number
  gender?: string
  collected: { name?: string; company?: string }
  collecting: 'gender' | 'name' | 'company' | 'email'
}

const FIELD_LABELS: Record<string, string> = {
  gender: 'nagovor (gospod/gospa)',
  name: 'ime in priimek kontaktne osebe',
  company: 'naziv podjetja',
  email: 'email naslov',
}

function buildSystem(salesContext: SalesContext | null, recentAnalyses: string): string {
  if (!salesContext) {
    return `Si Vera, AI prodajni asistent Carbonis (carbonis.eu) — marketing automation za lokalna podjetja.
Vikaj stranke (Vi, Vas, Vam). Knjižna slovenščina. Max 3 stavki.`
  }

  const { panoga, contacts, roi, pkg, price, gender, collected, collecting } = salesContext
  const collectedLines = [
    gender ? `- Nagovor: ${gender}` : null,
    collected.name ? `- Ime kontaktne osebe: ${collected.name}` : null,
    collected.company ? `- Naziv podjetja: ${collected.company}` : null,
  ].filter(Boolean).join('\n')
  const addressedName = gender && collected.name ? `${gender} ${collected.name}` : collected.name

  return `Si Vera, AI prodajni asistent Carbonis (carbonis.eu).

KONTEKST STRANKE:
- Panoga: ${panoga}
- Baza strank: ${contacts}
- ROI ocena: ${roi.toLocaleString('sl-SI')} €/mesec
- Priporočen paket: ${pkg} za ${price} €/mesec

${collectedLines ? `ZBRANO DO SEDAJ:\n${collectedLines}\n` : ''}
TRENUTNA NALOGA: Zberi **${FIELD_LABELS[collecting]}** — eno vprašanje, naravno, prijazno.
${addressedName ? `NAGOVOR STRANKE: Stranko naslovite kot "${addressedName}"` : ''}

PRAVILA:
- Vikaj: Vi, Vas, Vam — NIKOLI ti/te
- Knjižna slovenščina — NIKOLI "zaveza" za podjetje, NIKOLI "kompanija"
- Max 2-3 stavki + eno vprašanje
- Prijazen, profesionalen ton — ne robot, ampak svetovalka
- Uporabite nagovor (${addressedName ?? 'ime'}) ko naslavljate stranko
- NE postavljaj vprašanj izven trenutne naloge
- NE razlagaj zakaj rabiš podatek

${recentAnalyses ? `OPOMBE IZ PREJŠNJIH POGOVOROV:\n${recentAnalyses}` : ''}`
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
    const body = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      salesContext?: SalesContext
    }
    const { messages, salesContext } = body

    const recentAnalyses = await getRecentAnalyses()
    const system = buildSystem(salesContext ?? null, recentAnalyses)

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
