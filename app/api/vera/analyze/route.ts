import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen/qwen3.8-27b'

interface AnalyzePayload {
  conversation_log: Array<{ role: string; content: string }>
  industry?: string
  contacts_estimate?: string
  lead_id?: string
}

const ANALYZE_PROMPT = `Si analitik pogovorov AI asistentke Vere (Carbonis). Analiziraj spodnji pogovor in vrni SAMO JSON brez markdown, po tej shemi:
{
  "what_went_well": "kratko kaj je šlo dobro (max 150 znakov)",
  "what_to_improve": "kratko kaj je šlo narobe ali manjka (max 150 znakov)",
  "overall_rating": 1-5,
  "analysis_text": "podrobna analiza v 2-3 stavkih"
}

Ocenjevalna merila:
- 5: Vera je sledila funklu (panoga→stranke→ROI→ime→podjetje→email→GDPR), zbran lead
- 4: Vera je sledila, manjkal 1 korak
- 3: Vera je zbrala del podatkov, ni prišla do konca
- 2: Vera se je zmotila v vrstnem redu ali ponudila kar ne obstaja
- 1: Pogovor ni bil koristen, stranke ni vodila

Odgovori SAMO z JSON, nič drugega.`

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ ok: false }, { status: 503 })
  }

  try {
    const body: AnalyzePayload = await req.json()
    const { conversation_log, industry, contacts_estimate, lead_id } = body

    if (!conversation_log || conversation_log.length < 2) {
      return NextResponse.json({ ok: false, error: 'Premalo sporočil' }, { status: 400 })
    }

    const conversationText = conversation_log
      .map(m => `${m.role === 'assistant' ? 'Vera' : 'Stranka'}: ${m.content}`)
      .join('\n\n')

    const ac = new AbortController()
    const tId = setTimeout(() => ac.abort(), 20000)

    let analysis: { what_went_well: string; what_to_improve: string; overall_rating: number; analysis_text: string }

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: ANALYZE_PROMPT },
            { role: 'user', content: conversationText },
          ],
          max_tokens: 400,
          temperature: 0.3,
        }),
        signal: ac.signal,
      })

      clearTimeout(tId)

      if (!res.ok) {
        console.error('Groq analyze error:', await res.text())
        return NextResponse.json({ ok: false }, { status: 502 })
      }

      const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
      const raw = data?.choices?.[0]?.message?.content ?? ''
      // Strip markdown code fences if present
      const jsonStr = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
      analysis = JSON.parse(jsonStr)
    } finally {
      clearTimeout(tId)
    }

    const db = createAdminClient()
    await db.from('vera_session_logs').insert({
      conversation_log,
      lead_id: lead_id || null,
      industry: industry || null,
      contacts_estimate: contacts_estimate || null,
      what_went_well: analysis.what_went_well,
      what_to_improve: analysis.what_to_improve,
      overall_rating: Math.min(5, Math.max(1, Math.round(analysis.overall_rating))),
      analysis_text: analysis.analysis_text,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('vera/analyze error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
