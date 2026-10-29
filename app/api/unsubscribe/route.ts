import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new NextResponse('Invalid link', { status: 400 })

  const db = createAdminClient()
  await db.from('prospects').update({
    status: 'unsubscribed',
    last_action_at: new Date().toISOString(),
  }).eq('id', id)

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px 20px">
    <h2 style="color:#0B2471">Odjavljeni ste.</h2>
    <p style="color:#64748b">Ne boste več prejemali sporočil.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
