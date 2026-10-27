export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import NaviAdminClient from './_components/NaviAdminClient'

export const metadata = { title: 'Navi KB — Admin | Carbonis' }

export default async function NaviAdminPage() {
  const supabase = await createClient()

  const { data: knowledge } = await supabase
    .from('navi_knowledge')
    .select('*')
    .order('category', { ascending: true })

  const { data: conversations } = await supabase
    .from('navi_conversations')
    .select('id, session_id, user_id, messages, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50)

  return (
    <NaviAdminClient
      knowledge={knowledge ?? []}
      conversations={conversations ?? []}
    />
  )
}
