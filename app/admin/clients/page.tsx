export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'

const Info = ({ text }: { text: string }) => (
  <span title={text} style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#94a3b8" strokeWidth="1.2"/><path d="M6.5 5.5v3.5M6.5 4.2v-.2" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/></svg>
  </span>
)

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('profiles')
    .select('id, email, company_name, country, role, tier, trial_ends_at, created_at')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })

  const now = new Date()
  const getClientStatus = (c: { tier?: string; trial_ends_at?: string }) => {
    if (!c.tier || c.tier === 'free') {
      if (c.trial_ends_at && new Date(c.trial_ends_at) > now) return 'Trial'
      return 'Lead'
    }
    return 'Active'
  }

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Clients</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>{clients?.length ?? 0} registered companies</p>
        </div>
      </div>

      {/* Quick filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['All', 'Leads', 'Trial', 'Active'].map(f => (
          <span key={f} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: f === 'All' ? '#265CFF' : '#f1f5f9', color: f === 'All' ? 'white' : '#475569', cursor: 'pointer' }}>{f}</span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Info text="Filters are visual-only for now. CRM status (Lead/Trial/Active/Churned) will be driven by profiles.tier and trial_ends_at fields. Full filter functionality planned with CRM update." />
        </span>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Company</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Country</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Plan</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  CRM Status
                  <Info text="Lead = registered, no plan. Trial = active trial. Active = paid. Churned = cancelled. Full CRM notes/last-contact require a Supabase migration (add status, notes, last_contacted_at to profiles)." />
                </span>
              </th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Last Contact
                  <Info text="Last contact date will appear here once CRM fields are added to the profiles table." />
                </span>
              </th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {clients && clients.length > 0 ? clients.map((c, i) => {
              const status = getClientStatus(c)
              const statusColors: Record<string, [string, string]> = {
                Lead: ['#f1f5f9', '#475569'],
                Trial: ['#eff6ff', '#1d4ed8'],
                Active: ['#f0fdf4', '#16a34a'],
                Churned: ['#fee2e2', '#dc2626'],
              }
              const [bg, color] = statusColors[status] ?? ['#f1f5f9', '#475569']
              return (
                <tr key={c.id} style={{ borderBottom: i < clients.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{c.company_name ?? '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{c.email}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{c.country ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: c.tier === 'free' || !c.tier ? '#f1f5f9' : '#eff6ff', color: c.tier === 'free' || !c.tier ? '#64748b' : '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                      {c.tier ?? 'free'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: bg, color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>—</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              )
            }) : (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No clients yet — they will appear here after registration.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e' }}>
        <strong>CRM roadmap:</strong> To enable full CRM (notes, last_contacted_at, manual status override), run a Supabase migration adding <code>crm_status</code>, <code>notes</code>, <code>last_contacted_at</code> columns to the profiles table.
      </div>
    </div>
  )
}
