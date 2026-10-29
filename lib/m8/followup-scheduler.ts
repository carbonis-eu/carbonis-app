import { createAdminClient } from '@/lib/supabase/admin'
import { generateAndSendEmail } from './generate-email'

const FOLLOWUP_DAYS: Record<string, { days: number; type: 'followup_1' | 'followup_2' | 'followup_3' | 'final_attempt' }> = {
  email_sent: { days: 5,  type: 'followup_1' },
  followup_1: { days: 10, type: 'followup_2' },
  followup_2: { days: 15, type: 'followup_3' },
  followup_3: { days: 16, type: 'followup_3' }, // marks as lost next day
}

function daysSince(date: string | null): number {
  if (!date) return 999
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
}

export async function runFollowupScheduler(): Promise<{ sent: number; archived: number }> {
  const db = createAdminClient()
  let sent = 0
  let archived = 0

  // Get all active prospects that have been emailed
  const { data: prospects } = await db
    .from('prospects')
    .select('id, status, last_action_at, email, company_name')
    .in('status', ['email_sent', 'followup_1', 'followup_2', 'followup_3'])
    .not('email', 'is', null)

  if (!prospects?.length) return { sent, archived }

  for (const p of prospects) {
    const days = daysSince(p.last_action_at)

    // Archive as "lost" after followup_3 + 1 day
    if (p.status === 'followup_3' && days >= 1) {
      await db.from('prospects').update({
        status: 'lost',
        last_action_at: new Date().toISOString(),
      }).eq('id', p.id)
      archived++
      continue
    }

    const rule = FOLLOWUP_DAYS[p.status]
    if (!rule) continue
    if (days < rule.days) continue

    const ok = await generateAndSendEmail(p.id, rule.type)
    if (ok) {
      // Update status to next followup stage
      await db.from('prospects').update({
        status: rule.type,
        last_action_at: new Date().toISOString(),
      }).eq('id', p.id)
      sent++
    }
    await new Promise(r => setTimeout(r, 500)) // rate limit
  }

  // 90-day re-engagement: lost prospects older than 90 days
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000).toISOString()
  const { data: lostProspects } = await db
    .from('prospects')
    .select('id, email')
    .eq('status', 'lost')
    .lt('last_action_at', ninetyDaysAgo)
    .not('email', 'is', null)
    .limit(5) // max 5 re-engagements per day

  for (const p of (lostProspects ?? [])) {
    const ok = await generateAndSendEmail(p.id, 'final_attempt')
    if (ok) {
      await db.from('prospects').update({
        status: 'email_sent',
        last_action_at: new Date().toISOString(),
      }).eq('id', p.id)
      sent++
    }
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`[m8-followup] sent=${sent} archived=${archived}`)
  return { sent, archived }
}

// Called when a prospect replies with YES
export async function handleYesReply(prospectId: string): Promise<void> {
  const db = createAdminClient()
  await db.from('prospects').update({
    status: 'replied_yes',
    last_action_at: new Date().toISOString(),
  }).eq('id', prospectId)

  await generateAndSendEmail(prospectId, 'demo_link')
  console.log(`[m8-followup] YES reply handled for ${prospectId} — demo link sent`)
}
