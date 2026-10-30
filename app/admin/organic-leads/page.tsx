export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import LeadsTable from './_components/LeadsTable'

export default async function OrganicLeadsPage() {
  const db = createAdminClient()

  const { data: leads } = await db
    .from('organic_leads')
    .select('id, created_at, contact_name, company_name, email, industry, estimated_contacts, recommended_package, estimated_roi_eur, status, gdpr_consent, conversation_log, source')
    .order('created_at', { ascending: false })
    .limit(500)

  const list = leads ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <header style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '0 24px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
          Vera Leads{' '}
          <span style={{ color: '#94a3b8', fontWeight: 400 }}>({list.length})</span>
        </h1>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
          <span>Novi: <b style={{ color: '#265CFF' }}>{list.filter(l => l.status === 'new').length}</b></span>
          <span>·</span>
          <span>Konvertirani: <b style={{ color: '#16a34a' }}>{list.filter(l => l.status === 'converted').length}</b></span>
          <span>·</span>
          <span>Skupaj ROI ocena: <b style={{ color: '#0B2471' }}>
            {list.reduce((s, l) => s + (Number(l.estimated_roi_eur) || 0), 0).toLocaleString('sl-SI')} €/mes
          </b></span>
        </div>
      </header>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <LeadsTable leads={list} />
      </main>
    </div>
  )
}
