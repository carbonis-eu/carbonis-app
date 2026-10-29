'use client'

import { useState } from 'react'

interface TestResult {
  ok: boolean
  step?: string
  search?: { found: number; inserted: number }
  score?: { scored: number }
  preview_email?: { prospect?: Record<string, unknown>; email?: { subject: string; body: string }; message?: string; note?: string }
  stats?: {
    total: number
    scored: number
    emailSent: number
    repliedYes: number
    top5: Array<{ company_name: string; city: string; industry: string; lead_score: number; status: string; email: string | null; recommended_package: string | null }>
  }
  list_models?: Record<string, unknown>
  error?: string
}

export default function M8TestPanel() {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<TestResult | null>(null)
  const [limit, setLimit] = useState(5)

  async function run(step: string) {
    setLoading(step)
    setResult(null)
    try {
      const res = await fetch('/api/admin/m8-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, limit }),
      })
      const data = await res.json() as TestResult
      setResult(data)
    } catch (err) {
      setResult({ ok: false, error: String(err) })
    } finally {
      setLoading(null)
    }
  }

  const btn = (step: string, label: string, color = '#265CFF') => (
    <button
      onClick={() => run(step)}
      disabled={!!loading}
      style={{
        padding: '8px 16px', background: loading === step ? '#94a3b8' : color,
        color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading === step ? '⏳ Čakaj...' : label}
    </button>
  )

  return (
    <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed #e2e8f0', padding: '20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>🧪 M8 Test panel</span>
        <span style={{ fontSize: '11px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>samo za testiranje</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Limit:</span>
        <input
          type="number" value={limit} min={1} max={50}
          onChange={e => setLimit(Number(e.target.value))}
          style={{ width: '60px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }}
        />
        {btn('search', '1. Išči prospects', '#0B2471')}
        {btn('score', '2. Oceni (Gemini)', '#7c3aed')}
        {btn('preview_email', '3. Predogled emaila', '#d97706')}
        {btn('stats', '📊 Statistika', '#16a34a')}
        {btn('list_models', '🔍 Gemini modeli', '#64748b')}
      </div>

      {result && (
        <div style={{ background: result.ok ? '#f8fafc' : '#fff1f2', borderRadius: '8px', padding: '16px', fontSize: '12px', fontFamily: 'monospace' }}>
          {!result.ok && (
            <p style={{ color: '#dc2626', fontWeight: 700, marginBottom: '8px' }}>❌ Napaka: {result.error}</p>
          )}

          {result.search && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: 700, color: '#0B2471', marginBottom: '4px' }}>🔍 Iskanje:</p>
              <p>Najdenih: <b>{result.search.found}</b> | Dodanih v bazo: <b>{result.search.inserted}</b></p>
            </div>
          )}

          {result.score && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '4px' }}>🧠 Ocenjevanje:</p>
              <p>Ocenjenih: <b>{result.score.scored}</b></p>
            </div>
          )}

          {result.preview_email && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: 700, color: '#d97706', marginBottom: '8px' }}>📧 Predogled emaila:</p>
              {result.preview_email.message ? (
                <p style={{ color: '#64748b' }}>{result.preview_email.message}</p>
              ) : (
                <div style={{ fontFamily: 'sans-serif' }}>
                  {result.preview_email.prospect && (
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                      <b>{(result.preview_email.prospect as Record<string, string>).company_name}</b> · {(result.preview_email.prospect as Record<string, string>).email} · Score: {(result.preview_email.prospect as Record<string, string | number>).lead_score} · {(result.preview_email.prospect as Record<string, string>).recommended_package}
                    </p>
                  )}
                  {result.preview_email.email && (
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Zadeva: {result.preview_email.email.subject}
                      </p>
                      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
                      <pre style={{ fontSize: '12px', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {result.preview_email.email.body}
                      </pre>
                    </div>
                  )}
                  {result.preview_email.note && (
                    <p style={{ color: '#d97706', marginTop: '8px', fontSize: '11px' }}>⚠️ {result.preview_email.note}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {result.list_models && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>🔍 Gemini modeli:</p>
              <pre style={{ background: 'white', padding: '12px', borderRadius: '6px', overflow: 'auto', fontSize: '10px', maxHeight: '300px' }}>
                {JSON.stringify(result.list_models, null, 2)}
              </pre>
            </div>
          )}

          {result.stats && (
            <div>
              <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>📊 Statistika:</p>
              <p>Skupaj: <b>{result.stats.total}</b> | Ocenjenih: <b>{result.stats.scored}</b> | Email poslan: <b>{result.stats.emailSent}</b> | DA: <b>{result.stats.repliedYes}</b></p>
              {result.stats.top5?.length > 0 && (
                <table style={{ width: '100%', marginTop: '8px', borderCollapse: 'collapse', fontFamily: 'sans-serif' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      {['Podjetje', 'Mesto', 'Score', 'Email', 'Paket', 'Status'].map(h => (
                        <th key={h} style={{ padding: '4px 8px', textAlign: 'left', fontSize: '10px', color: '#64748b' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.stats.top5.map((p, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '4px 8px' }}>{p.company_name}</td>
                        <td style={{ padding: '4px 8px', color: '#64748b' }}>{p.city}</td>
                        <td style={{ padding: '4px 8px', fontWeight: 700, color: p.lead_score >= 7 ? '#16a34a' : '#d97706' }}>{p.lead_score}</td>
                        <td style={{ padding: '4px 8px', color: p.email ? '#16a34a' : '#dc2626' }}>{p.email ? '✓' : '✗'}</td>
                        <td style={{ padding: '4px 8px', color: '#64748b' }}>{p.recommended_package ?? '—'}</td>
                        <td style={{ padding: '4px 8px', color: '#64748b' }}>{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
