export const dynamic = 'force-dynamic'

export default function StranksePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Stranke</h1>
      </header>
      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '60px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="1.5"/><path d="M7 9h10M7 13h7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Plačujoče stranke</p>
          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '320px', margin: '0 auto' }}>
            Ta sekcija bo aktivna, ko bo prva stranka podpisala pogodbo in plačala naročnino.
            Evidenca: paket, datum, Xolo Go račun, affiliate popust.
          </p>
        </div>
      </main>
    </div>
  )
}
