import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const { text } = await request.json() as { text: string }
  if (!text || typeof text !== 'string' || text.length > 5000) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Prevedi v slovenščino. Vrni samo prevod, brez razlag:\n\n${text}` }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.2 },
      }),
    }
  )

  if (!res.ok) return NextResponse.json({ error: 'Translation failed' }, { status: 502 })
  const data = await res.json()
  const translation = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return NextResponse.json({ translation })
}
