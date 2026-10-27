export const dynamic = 'force-dynamic'

const Info = ({ text }: { text: string }) => (
  <span title={text} style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#94a3b8" strokeWidth="1.2"/><path d="M7 6v4M7 4.5v-.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
  </span>
)

export default function AdminReportsPage() {
  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Reports</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Client CBAM declarations and compliance reports.</p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Submitted Reports</h3>
          <Info text="Client CBAM annual declarations will appear here once clients generate their first report. First reporting deadline: 31 May 2027." />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Company', 'Report Type', 'Period', 'Status', 'Generated'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ padding: '56px', textAlign: 'center', color: '#94a3b8' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 10px', display: 'block' }}>
                  <rect x="5" y="3" width="26" height="30" rx="3" stroke="#cbd5e1" strokeWidth="1.8"/>
                  <path d="M11 13h14M11 18h14M11 23h8" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <p style={{ fontWeight: 500, marginBottom: '4px' }}>No reports submitted yet</p>
                <p style={{ fontSize: '12px', color: '#cbd5e1' }}>Reports will appear here once clients generate their first CBAM annual declaration.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
