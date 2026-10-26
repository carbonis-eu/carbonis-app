import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
  const key = `login:${ip}`

  const { allowed, retryAfterSeconds } = checkRateLimit(key)
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
      { status: 429 }
    )
  }

  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  resetRateLimit(key)
  return NextResponse.json({ success: true })
}
