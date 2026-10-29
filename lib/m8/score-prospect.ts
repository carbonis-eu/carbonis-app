import { createAdminClient } from '@/lib/supabase/admin'

interface ScoreResult {
  score: number
  reason: string
  recommended_package: 'starter' | 'growth' | 'pro'
  pain_points: string[]
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!

const SYSTEM_PROMPT = `Si lead scoring expert za podjetje ki prodaja AI growth sistem lokalnim podjetjem v Sloveniji.
Sistem ima 3 pakete: Starter (€149/mes — reaktivacija strank, SMS kampanje, zbiranje ocen), Growth (€249/mes — +GEO vidljivost, booking), Pro (€349/mes — +voice klici).

OCENJUJ na lestvici 1-10 kjer je 10 = idealna stranka:

Visok score (8-10) → VSI od tega:
- Google ocena < 4.2 (imajo nezadovoljne stranke)
- Vsaj 20+ ocen (aktivno podjetje)
- Ima email (jih lahko kontaktiramo)
- Mesto > 50.000 prebivalcev

Srednji score (5-7) → nekateri od tega:
- Dobra ocena ampak malo ocen (<30)
- Manjše mesto
- Ni emaila ampak ima telefon

Nizek score (1-4):
- Ocena > 4.5 (zadovoljne stranke, ni bolečine)
- Nima niti emaila niti telefona
- Manj kot 5 ocen (premajhno podjetje)

Vrni SAMO veljaven JSON brez markdown.`

export async function scoreProspect(prospectId: string): Promise<ScoreResult | null> {
  const db = createAdminClient()

  const { data: p, error } = await db
    .from('prospects')
    .select('company_name, industry, city, google_rating, google_reviews_count, website, email, phone')
    .eq('id', prospectId)
    .single()

  if (error || !p) {
    console.error('[m8-score] prospect not found:', prospectId)
    return null
  }

  const prompt = `Oceni tega prospekta:

Podjetje: ${p.company_name}
Branža: ${p.industry}
Mesto: ${p.city ?? 'neznano'}
Google ocena: ${p.google_rating ?? 'ni podatka'} (${p.google_reviews_count ?? 0} ocen)
Spletna stran: ${p.website ? 'DA' : 'NE'}
Email: ${p.email ? 'DA' : 'NE'}
Telefon: ${p.phone ? 'DA' : 'NE'}

Vrni JSON:
{
  "score": <1-10>,
  "reason": "<1-2 stavka zakaj tak score — specifično za to podjetje>",
  "recommended_package": "<starter|growth|pro>",
  "pain_points": ["<točka1>", "<točka2>"]
}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error(`Anthropic error: ${res.status}`)
    const data = await res.json() as { content: Array<{ text: string }> }
    const raw = data.content?.[0]?.text ?? ''
    const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result = JSON.parse(json) as ScoreResult

    // Save score back to prospect
    await db.from('prospects').update({
      lead_score: result.score,
      ai_notes: result.reason,
      recommended_package: result.recommended_package,
      pain_points: result.pain_points,
      status: 'scored',
      last_action_at: new Date().toISOString(),
    }).eq('id', prospectId)

    return result
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[m8-score] error:', msg)
    await db.from('m8_error_logs').insert({
      step: 'score',
      error: msg,
      context: { prospect_id: prospectId },
    })
    return null
  }
}

// Score all unscored prospects in batch
export async function scoreNewProspects(limit = 50): Promise<number> {
  const db = createAdminClient()
  const { data: prospects } = await db
    .from('prospects')
    .select('id')
    .eq('status', 'new')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (!prospects?.length) return 0

  let scored = 0
  for (const p of prospects) {
    const result = await scoreProspect(p.id)
    if (result) scored++
    await new Promise(r => setTimeout(r, 300)) // rate limit
  }

  console.log(`[m8-score] scored=${scored}/${prospects.length}`)
  return scored
}
