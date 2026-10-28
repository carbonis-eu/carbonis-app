export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import OutreachClient from './_components/OutreachClient'

export const metadata = { title: 'Outreach & CRM — Admin | Carbonis' }

export default async function OutreachPage() {
  const db = createAdminClient()

  const [{ data: prospects }, { data: subscribers }] = await Promise.all([
    db.from('outreach_prospects')
      .select('*, crm_activity(id, type, created_at)')
      .order('created_at', { ascending: false })
      .limit(500),
    db.from('newsletter_subscribers')
      .select('id, email, name, country, source, status, subscribed_at')
      .order('subscribed_at', { ascending: false })
      .limit(500),
  ])

  return (
    <OutreachClient
      prospects={prospects ?? []}
      subscribers={subscribers ?? []}
    />
  )
}
