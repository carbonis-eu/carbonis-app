import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { handleYesReply } from '@/lib/m8/followup-scheduler'

interface BrevoEvent {
  event: 'delivered' | 'opened' | 'click' | 'hard_bounce' | 'soft_bounce' | 'reply'
  'message-id'?: string
  email?: string
  date?: string
  reply?: string
}

export async function POST(req: NextRequest) {
  const events = await req.json() as BrevoEvent | BrevoEvent[]
  const db = createAdminClient()
  const list = Array.isArray(events) ? events : [events]

  for (const ev of list) {
    const messageId = ev['message-id']
    if (!messageId) continue

    const now = new Date().toISOString()

    // Find the email log by brevo_message_id
    const { data: log } = await db
      .from('email_logs')
      .select('id, prospect_id')
      .eq('brevo_message_id', messageId)
      .maybeSingle()

    if (!log) continue

    switch (ev.event) {
      case 'delivered':
        await db.from('email_logs').update({ status: 'delivered' }).eq('id', log.id)
        break

      case 'opened':
        await db.from('email_logs').update({ status: 'opened', opened_at: now }).eq('id', log.id)
        // Prioritize high-score opened prospects
        await db.from('prospects').update({ last_action_at: now })
          .eq('id', log.prospect_id).eq('status', 'email_sent')
        break

      case 'click':
        await db.from('email_logs').update({ status: 'clicked', clicked_at: now }).eq('id', log.id)
        break

      case 'hard_bounce':
      case 'soft_bounce':
        await db.from('email_logs').update({ status: 'bounced' }).eq('id', log.id)
        await db.from('prospects').update({ status: 'lost' }).eq('id', log.prospect_id)
        break

      case 'reply': {
        const replyText = ev.reply ?? ''
        await db.from('email_logs').update({
          status: 'replied',
          replied_at: now,
          reply_content: replyText.slice(0, 2000),
        }).eq('id', log.id)

        // Detect YES reply
        const lower = replyText.toLowerCase()
        const isYes = /\bda\b|yes|zanima|pošlji|demo|naprej|ok\b|v redu/.test(lower)
        const isNo = /\bne\b|no\b|hvala.*ne|not interested|zahvaljujem.*ne/.test(lower)

        if (isYes) {
          await db.from('prospects').update({ status: 'replied_yes' }).eq('id', log.prospect_id)
          await handleYesReply(log.prospect_id)
        } else if (isNo) {
          await db.from('prospects').update({ status: 'replied_no' }).eq('id', log.prospect_id)
        }
        break
      }
    }
  }

  return NextResponse.json({ ok: true })
}
