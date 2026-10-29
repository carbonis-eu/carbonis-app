import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchProspects } from '@/lib/m8/search-prospects'
import { scoreNewProspects } from '@/lib/m8/score-prospect'
import { generateEmailPreview } from '@/lib/m8/generate-email'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  // Admin only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const metaRole = (user.app_metadata as Record<string, string> | null)?.role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (metaRole !== 'admin' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as { step?: string; limit?: number; prospect_id?: string }
  const step = body.step ?? 'search'
  const limit = body.limit ?? 10
  const prospectIdParam = body.prospect_id

  const db = createAdminClient()
  const results: Record<string, unknown> = {}

  try {
    if (step === 'search' || step === 'all') {
      const searchResult = await searchProspects(limit)
      results.search = searchResult
    }

    if (step === 'score' || step === 'all') {
      const scored = await scoreNewProspects(limit)
      results.score = { scored }
    }

    if (step === 'preview_email') {
      const query = prospectIdParam
        ? db.from('prospects').select('*').eq('id', prospectIdParam).single()
        : db.from('prospects').select('*').eq('status', 'scored').order('lead_score', { ascending: false }).limit(1).single()
      const { data: prospect } = await query

      if (!prospect) {
        results.preview_email = { message: 'Ni ocenjenih prospects. Najprej poženi search + score.' }
      } else {
        const generated = await generateEmailPreview({
          prospect_id: prospect.id,
          company_name: prospect.company_name,
          industry: prospect.industry,
          city: prospect.city,
          google_rating: prospect.google_rating,
          google_reviews_count: prospect.google_reviews_count,
          website: prospect.website,
          recommended_package: prospect.recommended_package,
          pain_points: prospect.pain_points,
          ai_notes: prospect.ai_notes,
        })
        results.preview_email = {
          prospect: {
            company_name: prospect.company_name,
            email: prospect.email,
            lead_score: prospect.lead_score,
            recommended_package: prospect.recommended_package,
          },
          email: generated,
          note: 'Email NI poslan — samo predogled.',
        }
      }
    }

    if (step === 'list_models') {
      const geminiKey = process.env.GEMINI_API_KEY
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${geminiKey}`)
      const data = await res.json()
      results.list_models = data
    }

    if (step === 'stats') {
      const [
        { count: total },
        { count: scored },
        { count: emailSent },
        { count: repliedYes },
        { data: top5 },
      ] = await Promise.all([
        db.from('prospects').select('id', { count: 'exact', head: true }),
        db.from('prospects').select('id', { count: 'exact', head: true }).eq('status', 'scored'),
        db.from('prospects').select('id', { count: 'exact', head: true }).eq('status', 'email_sent'),
        db.from('prospects').select('id', { count: 'exact', head: true }).eq('status', 'replied_yes'),
        db.from('prospects').select('company_name, city, industry, lead_score, status, email, recommended_package').order('lead_score', { ascending: false }).limit(5),
      ])
      results.stats = { total, scored, emailSent, repliedYes, top5 }
    }

    return NextResponse.json({ ok: true, step, ...results })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
