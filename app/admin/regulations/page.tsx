export const dynamic = 'force-dynamic'

const Info = ({ text }: { text: string }) => (
  <span title={text} style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#94a3b8" strokeWidth="1.2"/><path d="M7 6v4M7 4.5v-.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
  </span>
)

export default function AdminRegulationsPage() {
  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Regulations</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Manage EU carbon regulation updates pushed to client dashboards.</p>
        </div>
        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, color: '#94a3b8', cursor: 'not-allowed' }}>
          + Add Regulation Update
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Regulation Updates</h3>
          <Info text="Here you manage CBAM regulatory updates, EU announcements, and country-specific compliance changes. Updates are pushed to client dashboards automatically." />
        </div>
        <div style={{ padding: '56px 20px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
            <rect x="6" y="4" width="28" height="32" rx="3" stroke="#cbd5e1" strokeWidth="2"/>
            <path d="M13 14h14M13 20h14M13 26h8" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>No regulation updates yet</p>
          <p style={{ color: '#cbd5e1', fontSize: '12px', maxWidth: '320px', margin: '0 auto' }}>
            Add CBAM or ETS regulatory updates here. They will be visible to all clients in their compliance dashboard.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '10px' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="8" cy="8" r="7" stroke="#3b82f6" strokeWidth="1.3"/><path d="M8 7v4M8 5.5v-.5" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round"/></svg>
        <p style={{ fontSize: '12px', color: '#1d4ed8', lineHeight: 1.5 }}>
          <strong>Key CBAM dates:</strong> Transitional period ended 31 Dec 2025. Definitive period active from 1 Jan 2026. First annual declaration due 31 May 2027 (covering 2026 imports). Certificate surrender deadline: 30 Sep 2027.
        </p>
      </div>
    </div>
  )
}
