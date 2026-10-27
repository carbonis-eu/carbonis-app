import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_ROLES = ['buyer', 'seller', 'compliance'] as const
type ValidRole = typeof VALID_ROLES[number]

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  // Handle both form POST (from RoleSelector) and JSON (from future API calls)
  const contentType = request.headers.get('content-type') ?? ''
  let role: string

  if (contentType.includes('application/json')) {
    const body = await request.json() as { role?: string }
    role = body.role ?? ''
  } else {
    const formData = await request.formData()
    role = (formData.get('role') as string) ?? ''
  }

  if (!VALID_ROLES.includes(role as ValidRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', user.id)
  if (error) {
    // On DB error, redirect back; user can retry
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
