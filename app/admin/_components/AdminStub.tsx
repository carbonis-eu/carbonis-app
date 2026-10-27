export default function AdminStub({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ padding: '32px 28px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{title}</h1>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>{description}</p>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
        Section coming soon
      </div>
    </div>
  )
}
