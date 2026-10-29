'use client'

import { useState } from 'react'

interface EmailPreview {
  subject: string
  body: string
}

export default function EmailPreviewButton({ prospectId, hasEmail }: { prospectId: string; hasEmail: boolean }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<EmailPreview | null>(null)
  const [open, setOpen] = useState(false)

  if (!hasEmail) return <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>

  async function load() {
    if (preview) { setOpen(true); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/m8-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'preview_email', prospect_id: prospectId }),
      })
      const data = await res.json() as { preview_email?: { email?: EmailPreview } }
      if (data.preview_email?.email) {
        setPreview(data.preview_email.email)
        setOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={load}
        disabled={loading}
        style={{ padding: '3px 8px', background: loading ? '#e2e8f0' : '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#475569', cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? '...' : '📧 Email'}
      </button>

      {open && preview && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '560px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Predogled emaila</p>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zadeva</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{preview.subject}</p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vsebina</p>
              <pre style={{ fontSize: '13px', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{preview.body}</pre>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px' }}>⚠️ Predogled — email ni poslan</p>
          </div>
        </div>
      )}
    </>
  )
}
