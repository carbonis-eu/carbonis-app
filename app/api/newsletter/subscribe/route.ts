import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const { email, name, country, source = 'landing', interests = [] } = await request.json() as {
    email: string
    name?: string
    country?: string
    source?: string
    interests?: string[]
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const db = createAdminClient()
  const { error } = await db.from('newsletter_subscribers').upsert(
    { email, name, country, source, interests, status: 'active', subscribed_at: new Date().toISOString() },
    { onConflict: 'email' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
