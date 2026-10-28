import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const SYSTEM_BASE = `You are Navi, the support assistant for Carbonis (carbonis.eu) — an EU CBAM compliance platform and carbon certificate marketplace.

STRICT RULES:
- NEVER say "Odlično!", "Super!", "Seveda!", "Great!", "Excellent!", "Of course!", "Absolutely!" or any filler opener. Start directly with the answer.
- NEVER invent or describe features that do not exist. Carbonis has: CBAM calculator (on the home page), compliance dashboard, certificate marketplace (list/browse surplus certificates), XML declaration export, supplier emissions request tool, OTC bulletin board (PRO Trading only), CBAM declaration builder. If unsure whether a feature exists, say "Contact us at info@carbonis.eu for details."
- NEVER mention commissions, transaction fees, or brokerage fees — the Seller plan is 100% free with zero fees.
- ONLY answer questions about Carbonis platform, CBAM regulations, EU carbon markets, and certificate trading. Politely decline anything else.
- Keep answers short — maximum 3 sentences unless a step-by-step is needed.
- Always end with one concrete next step (a URL or action).
- Respond in the same language the user writes in.`

type MessageParam = { role: 'user' | 'assistant'; content: string }

// ISO-639-1 detection from message text (basic heuristic by common words)
function detectLang(text: string): string {
  const t = text.toLowerCase()
  if (/\b(kaj|kako|kdaj|zakaj|prosim|hvala|sem|ali|pa|da)\b/.test(t)) return 'sl'
  if (/\b(wie|was|warum|bitte|danke|ich|haben|ist|sind)\b/.test(t)) return 'de'
  if (/\b(jak|co|dlaczego|proszę|dziękuję|jest|mam|czy)\b/.test(t)) return 'pl'
  if (/\b(ce|comment|pourquoi|merci|s'il vous|avoir|est)\b/.test(t)) return 'fr'
  if (/\b(cosa|come|perché|grazie|prego|avere|essere)\b/.test(t)) return 'it'
  if (/\b(qué|cómo|por qué|gracias|tener|estar|hacer)\b/.test(t)) return 'es'
  if (/\b(co|jak|proč|prosím|děkuji|mít|být)\b/.test(t)) return 'cs'
  if (/\b(mi|az|egy|hogy|nem|van|volt|lesz)\b/.test(t)) return 'hu'
  if (/\b(ce|cum|de ce|mulțumesc|aveți|este|sunt)\b/.test(t)) return 'ro'
  return 'en'
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  // Geo detection via Vercel headers
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown'
  const city = request.headers.get('x-vercel-ip-city') ?? ''

  const { message, sessionId, history = [] } = await request.json() as {
    message: string
    sessionId: string
    history: MessageParam[]
  }

  if (!message || typeof message !== 'string' || message.length > 1000) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  // RAG-lite: search knowledge base
  const adminDb = createAdminClient()
  const { data: kb } = await adminDb
    .from('navi_knowledge')
    .select('question, answer')
    .or(`question.ilike.%${message.slice(0, 50)}%,answer.ilike.%${message.slice(0, 50)}%`)
    .limit(3)

  const kbContext = kb && kb.length > 0
    ? `\n\nRelevant Carbonis platform info:\n${kb.map((r: { question: string; answer: string }) => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n')}`
    : ''

  const systemPrompt = SYSTEM_BASE + kbContext

  // Build Gemini contents (role: user/model, not assistant)
  const recentHistory = (history as MessageParam[]).slice(-6)
  const contents = [
    ...recentHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ]

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
      }),
    }
  )

  if (!geminiRes.ok || !geminiRes.body) {
    return NextResponse.json({ error: 'AI service error' }, { status: 502 })
  }

  // Transform Gemini SSE → Anthropic SSE format (widget stays unchanged)
  let fullText = ''
  const encoder = new TextEncoder()

  const transformed = new ReadableStream({
    async start(controller) {
      const reader = geminiRes.body!.getReader()
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
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
              if (!text) continue
              fullText += text
              // Emit Anthropic-compatible SSE chunk
              const chunk = `data: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text } })}\n\n`
              controller.enqueue(encoder.encode(chunk))
            } catch { /* skip malformed */ }
          }
        }
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }

      // Save conversation with geo + language metadata (non-blocking)
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      void (async () => {
        try {
          const allMessages = [...recentHistory, { role: 'user', content: message }, { role: 'assistant', content: fullText }]
          const firstUserMsg = allMessages.find(m => m.role === 'user')?.content ?? message
          const detectedLang = detectLang(firstUserMsg)
          await adminDb.from('navi_conversations').upsert({
            session_id: sessionId,
            user_id: user?.id ?? null,
            messages: allMessages,
            updated_at: new Date().toISOString(),
            country,
            city,
            lang: detectedLang,
            first_question: firstUserMsg.slice(0, 200),
          }, { onConflict: 'session_id' })
        } catch { /* ignore */ }
      })()
    },
  })

  return new Response(transformed, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
