export const dynamic = 'force-dynamic'

export default function FinancePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Finance</h1>
      </header>
      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'MRR', value: '€0', sub: 'Mesečni prihodek', color: '#16a34a' },
            { label: 'Stranke', value: '0', sub: 'Aktivne naročnine', color: '#2563eb' },
            { label: 'Churn', value: '0%', sub: 'Ta mesec', color: '#64748b' },
          ].map(k => (
            <div key={k.label} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>{k.label}</p>
              <p style={{ color: '#0f172a', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>{k.value}</p>
              <p style={{ color: k.color, fontSize: '11px' }}>{k.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          Finance dashboard — aktivno ob prvi plačujoči stranki.
          <br/><br/>
          <span style={{ fontSize: '12px' }}>Načrtovano: MRR graf, seznam Xolo Go računov, churn analiza, affiliate izplačila.</span>
        </div>
      </main>
    </div>
  )
}
