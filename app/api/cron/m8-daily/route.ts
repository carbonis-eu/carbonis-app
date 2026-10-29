import { NextRequest, NextResponse } from 'next/server'
import { searchProspects } from '@/lib/m8/search-prospects'
import { scoreNewProspects } from '@/lib/m8/score-prospect'
import { generateAndSendEmail } from '@/lib/m8/generate-email'
import { runFollowupScheduler } from '@/lib/m8/followup-scheduler'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_EMAILS_PER_DAY = 50

export async function GET(req: NextRequest) {
  // Verify cron secret
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createAdminClient()
  const startedAt = new Date().toISOString()
  const log: string[] = []

  try {
    // 1. Find new prospects
    log.push('Step 1: searching prospects...')
    const { found, inserted } = await searchProspects(100)
    log.push(`  found=${found} inserted=${inserted}`)

    // 2. Score new prospects
    log.push('Step 2: scoring prospects...')
    const scored = await scoreNewProspects(50)
    log.push(`  scored=${scored}`)

    // 3. Send initial emails to high-score prospects (score >= 7, has email, not yet emailed)
    log.push('Step 3: sending initial emails...')
    const { data: toEmail } = await db
      .from('prospects')
      .select('id')
      .eq('status', 'scored')
      .gte('lead_score', 7)
      .not('email', 'is', null)
      .limit(MAX_EMAILS_PER_DAY)

    let emailsSent = 0
    for (const p of (toEmail ?? [])) {
      if (emailsSent >= MAX_EMAILS_PER_DAY) break
      const ok = await generateAndSendEmail(p.id, 'initial')
      if (ok) emailsSent++
      await new Promise(r => setTimeout(r, 1000)) // 1 email/sec
    }
    log.push(`  initial emails sent=${emailsSent}`)

    // 4. Run followups
    log.push('Step 4: running followups...')
    const remaining = MAX_EMAILS_PER_DAY - emailsSent
    if (remaining > 0) {
      const { sent: followupSent, archived } = await runFollowupScheduler()
      log.push(`  followups sent=${followupSent} archived=${archived}`)
    }

    log.push(`Done. Started at ${startedAt}`)
    console.log('[m8-daily]', log.join('\n'))

    return NextResponse.json({ ok: true, log })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[m8-daily] fatal error:', msg)
    await db.from('m8_error_logs').insert({ step: 'cron-daily', error: msg, context: { log } })
    return NextResponse.json({ ok: false, error: msg, log }, { status: 500 })
  }
}
