/**
 * generate-kb-from-conversations.mjs
 *
 * Analyzes recent Navi conversations with Gemini and suggests new KB entries.
 *
 * Usage:
 *   node --env-file=.env.local scripts/generate-kb-from-conversations.mjs
 *   node --env-file=.env.local scripts/generate-kb-from-conversations.mjs --insert
 *
 * --insert   Automatically inserts suggestions into navi_knowledge table
 * --limit N  Number of conversations to analyze (default: 50)
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read env from .env.local if not already set
function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  try {
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx)
      const val = trimmed.slice(idx + 1).replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    console.error('Warning: could not read .env.local — using process.env')
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY')
  process.exit(1)
}

const args = process.argv.slice(2)
const shouldInsert = args.includes('--insert')
const limitArg = args.indexOf('--limit')
const limit = limitArg !== -1 ? parseInt(args[limitArg + 1]) || 50 : 50

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ─── Fetch data ───────────────────────────────────────────────────────────────

console.log(`\n📥 Fetching last ${limit} conversations...`)
const { data: conversations, error: convErr } = await supabase
  .from('navi_conversations')
  .select('messages, first_question, lang, country, created_at')
  .order('created_at', { ascending: false })
  .limit(limit)

if (convErr) { console.error('Supabase error:', convErr.message); process.exit(1) }
if (!conversations?.length) {
  console.log('No conversations found. Chat with Navi first to generate data.')
  process.exit(0)
}
console.log(`✓ Got ${conversations.length} conversations`)

console.log('📚 Fetching existing KB entries...')
const { data: existingKb } = await supabase
  .from('navi_knowledge')
  .select('category, question, answer')
  .order('created_at', { ascending: true })

const kbCount = existingKb?.length ?? 0
console.log(`✓ Got ${kbCount} existing KB entries`)

// ─── Build Gemini prompt ──────────────────────────────────────────────────────

const existingKbText = (existingKb ?? [])
  .map(e => `[${e.category}] Q: ${e.question}`)
  .join('\n')

// Extract meaningful Q&A pairs from conversations
const convExcerpts = conversations
  .map(c => {
    const msgs = c.messages ?? []
    const pairs = []
    for (let i = 0; i < msgs.length - 1; i++) {
      if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'assistant') {
        pairs.push(`  U: ${msgs[i].content.slice(0, 150)}\n  A: ${msgs[i + 1].content.slice(0, 200)}`)
      }
    }
    return pairs.join('\n')
  })
  .filter(Boolean)
  .join('\n---\n')

const prompt = `You are a knowledge base curator for Carbonis (carbonis.eu) — an EU CBAM compliance platform and carbon certificate marketplace.

EXISTING KNOWLEDGE BASE (${kbCount} entries — do NOT repeat these topics):
${existingKbText || '(empty)'}

RECENT NAVI CONVERSATIONS:
${convExcerpts.slice(0, 12000)}

TASK: Identify 5-10 questions from the conversations that represent real user needs NOT already covered in the KB. Write accurate answers for each.

STRICT RULES:
- Seller plan is completely FREE with ZERO fees — never mention any commission or fee for sellers
- Do NOT invent features that don't exist. Carbonis has: CBAM calculator, compliance dashboard, XML export, certificate marketplace, supplier emissions request tool, OTC bulletin board (PRO Trading only), CBAM declaration builder
- Do NOT include unverified ETS prices or statistics
- Answers: 2-4 sentences max, end with a concrete next step (URL or action)
- Only include NEW topics — nothing that overlaps with existing KB
- Respond in ENGLISH only

Return ONLY a valid JSON array, no explanation, no markdown:
[
  {
    "category": "compliance|calculator|registration|selling|trading|market|platform|support",
    "question": "Natural user question",
    "answer": "Concise accurate answer with next step."
  }
]`

// ─── Call Gemini ──────────────────────────────────────────────────────────────

console.log('\n🤖 Calling Gemini for KB suggestions...')
const geminiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
    }),
  }
)

if (!geminiRes.ok) {
  const err = await geminiRes.text()
  console.error('Gemini error:', err)
  process.exit(1)
}

const geminiJson = await geminiRes.json()
const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

// Strip markdown code fences if present
const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

let suggestions
try {
  suggestions = JSON.parse(jsonText)
  if (!Array.isArray(suggestions)) throw new Error('Not an array')
} catch (e) {
  console.error('\nGemini returned non-JSON response:')
  console.error(rawText)
  process.exit(1)
}

// ─── Output suggestions ───────────────────────────────────────────────────────

console.log(`\n✨ Gemini suggested ${suggestions.length} new KB entries:\n`)
console.log('─'.repeat(70))

for (const [i, s] of suggestions.entries()) {
  console.log(`\n${i + 1}. [${s.category}]`)
  console.log(`   Q: ${s.question}`)
  console.log(`   A: ${s.answer}`)
}

console.log('\n' + '─'.repeat(70))

// ─── Insert if flag set ───────────────────────────────────────────────────────

if (shouldInsert) {
  console.log('\n💾 Inserting into navi_knowledge...')
  const toInsert = suggestions.map(s => ({
    category: s.category,
    question: s.question,
    answer: s.answer,
  }))
  const { error: insertErr, data: inserted } = await supabase
    .from('navi_knowledge')
    .insert(toInsert)
    .select('id, question')

  if (insertErr) {
    console.error('Insert error:', insertErr.message)
  } else {
    console.log(`✓ Inserted ${inserted?.length ?? 0} entries into navi_knowledge`)
    for (const row of (inserted ?? [])) {
      console.log(`  - [${row.id}] ${row.question}`)
    }
  }
} else {
  console.log('\n💡 Dry-run mode. To insert into DB, run with --insert flag.')
  console.log('   node --env-file=.env.local scripts/generate-kb-from-conversations.mjs --insert')
}

console.log()
