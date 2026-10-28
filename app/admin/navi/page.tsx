export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import NaviAdminClient from './_components/NaviAdminClient'

export const metadata = { title: 'Navi KB — Admin | Carbonis' }

export default async function NaviAdminPage() {
  const supabase = createAdminClient()

  const [{ data: knowledge }, { data: conversations }] = await Promise.all([
    supabase
      .from('navi_knowledge')
      .select('*')
      .order('category', { ascending: true }),
    supabase
      .from('navi_conversations')
      .select('id, session_id, user_id, messages, created_at, updated_at, country, city, lang, first_question')
      .order('updated_at', { ascending: false })
      .limit(100),
  ])

  return (
    <NaviAdminClient
      knowledge={knowledge ?? []}
      conversations={conversations ?? []}
    />
  )
}
