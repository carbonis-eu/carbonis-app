import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_BASE = `You are Navi, the support assistant for Carbonis (carbonis.eu) — an EU CBAM compliance platform and carbon certificate marketplace.

You ONLY answer questions about the Carbonis platform: its features, pricing plans, how to use tools, and how to get started.

If asked anything outside this scope, respond exactly: "I can help you with questions about the Carbonis platform. For CBAM regulatory advice, please consult your compliance team or the EU CBAM Registry directly."

Keep answers short — maximum 3 sentences unless a step-by-step is needed. Always end with an actionable next step when relevant.`

type MessageParam = { role: 'user' | 'assistant'; content: string }

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const { message, sessionId, history = [] } = await request.json() as {
    message: string
    sessionId: string
    history: MessageParam[]
  }

  if (!message || typeof message !== 'string' || message.length > 1000) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  // Search knowledge base for relevant context
  const supabase = await createClient()
  const { data: kb } = await supabase
    .from('navi_knowledge')
    .select('question, answer')
    .or(`question.ilike.%${message.slice(0, 50)}%,answer.ilike.%${message.slice(0, 50)}%`)
    .eq('is_active', true)
    .limit(3)

  const kbContext = kb && kb.length > 0
    ? `\n\nRelevant platform information:\n${kb.map((r: { question: string; answer: string }) => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n')}`
    : ''

  const systemPrompt = SYSTEM_BASE + kbContext

  // Keep last 6 messages for context window efficiency
  const recentHistory = (history as MessageParam[]).slice(-6)

  // Stream response
  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 300,
    system: systemPrompt,
    messages: [...recentHistory, { role: 'user', content: message }],
  })

  // Save conversation async (non-blocking)
  const { data: { user } } = await supabase.auth.getUser()
  stream.finalMessage().then((msg) => {
    const assistantText = msg.content[0]?.type === 'text' ? msg.content[0].text : ''
    supabase.from('navi_conversations').upsert({
      session_id: sessionId,
      user_id: user?.id ?? null,
      messages: [...recentHistory, { role: 'user', content: message }, { role: 'assistant', content: assistantText }],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'session_id' }).then(() => {})
  }).catch(() => {})

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
