'use client'

import { useState } from 'react'

const cobalt = '#356AE6'
const navy = '#0B2471'
const green = '#1E7A56'

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: 'Nov',         color: '#64748b', bg: '#f1f5f9' },
  contacted: { label: 'Kontaktiran', color: '#2563eb', bg: '#dbeafe' },
  converted: { label: 'Konvertiran', color: '#16a34a', bg: '#dcfce7' },
  lost:      { label: 'Izgubljen',   color: '#dc2626', bg: '#fee2e2' },
}

const INDUSTRY_LABELS: Record<string, string> = {
  avtoservis:   'Avtoservis',
  kozmetika:    'Kozmetika',
  fitnes:       'Fitnes',
  gostinstvo:   'Gostinstvo',
  nepremicnine: 'Nepremičnine',
  ordinacije:   'Ordinacija',
  drugo:        'Drugo',
}

interface Lead {
  id: string
  created_at: string | null
  contact_name: string | null
  company_name: string | null
  email: string | null
  industry: string | null
  estimated_contacts: string | null
  recommended_package: string | null
  estimated_roi_eur: number | null
  status: string | null
  gdpr_consent: boolean | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversation_log: any
  source: string | null
  email_draft: string | null
  email_sent_at: string | null
}

function ConversationModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const messages: Array<{ role: string; content: string }> = Array.isArray(lead.conversation_log)
    ? lead.conversation_log
    : []

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '18px',
          width: '520px', maxWidth: '100%', maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div style={{
          background: navy, borderRadius: '18px 18px 0 0',
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '15px', margin: 0 }}>
              {lead.contact_name} — {lead.company_name}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '2px 0 0' }}>
              {lead.email} · {INDUSTRY_LABELS[lead.industry ?? ''] ?? lead.industry} · {lead.estimated_contacts}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '22px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>
        </div>

        {/* Lead summary */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px',
        }}>
          <span>Paket: <b>{lead.recommended_package ?? '—'}</b></span>
          <span>ROI ocena: <b style={{ color: cobalt }}>{lead.estimated_roi_eur ? `${Number(lead.estimated_roi_eur).toLocaleString('sl-SI')} €/mes` : '—'}</b></span>
          <span>GDPR: <b style={{ color: lead.gdpr_consent ? '#16a34a' : '#dc2626' }}>{lead.gdpr_consent ? '✓ Da' : '✗ Ne'}</b></span>
        </div>

        {/* Conversation */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {messages.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>Ni shranjenih sporočil.</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  background: m.role === 'user' ? cobalt : '#f1f5f9',
                  color: m.role === 'user' ? 'white' : '#0f172a',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '8px 13px', fontSize: '13.5px', lineHeight: 1.5,
                }}>
                  <span style={{
                    display: 'block', fontSize: '10px',
                    color: m.role === 'user' ? 'rgba(255,255,255,0.65)' : '#94a3b8',
                    marginBottom: '3px', fontWeight: 600,
                  }}>
                    {m.role === 'user' ? 'Stranka' : 'Vera'}
                  </span>
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            {lead.created_at ? new Date(lead.created_at).toLocaleString('sl-SI') : ''} · vir: {lead.source ?? 'vera_chatbot'}
          </p>
        </div>
      </div>
    </div>
  )
}

function EmailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  async function handleSend() {
    setSending(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/send-lead-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id }),
      })
      const data = await res.json() as { ok: boolean; error?: string }
      if (!data.ok) { setErr(data.error ?? 'Napaka'); return }
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '18px', width: '620px', maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ background: green, borderRadius: '18px 18px 0 0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '15px', margin: 0 }}>Email stranki: {lead.contact_name}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '2px 0 0' }}>{lead.email}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '22px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
          {lead.email_draft ? (
            <iframe
              srcDoc={lead.email_draft}
              title="Email predogled"
              style={{ width: '100%', height: '400px', border: 'none' }}
              sandbox="allow-same-origin"
            />
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
              Osnutek emaila ni bil ustvarjen. Preverite ali je lead zbral vse podatke.
            </div>
          )}
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
          {lead.email_sent_at && !sent && (
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Poslano: {new Date(lead.email_sent_at).toLocaleString('sl-SI')}
            </span>
          )}
          {err && <span style={{ fontSize: '12px', color: '#dc2626' }}>{err}</span>}
          {sent ? (
            <span style={{ color: green, fontWeight: 700, fontSize: '14px' }}>✓ Email poslan!</span>
          ) : (
            <button
              onClick={handleSend}
              disabled={sending || !lead.email_draft}
              style={{
                background: sending ? '#94a3b8' : green, color: 'white',
                border: 'none', borderRadius: '8px', padding: '9px 20px',
                fontSize: '13px', fontWeight: 700, cursor: sending ? 'wait' : 'pointer',
              }}
            >
              {sending ? 'Pošiljam...' : lead.email_sent_at ? 'Pošlji ponovno' : 'Pošlji stranki'}
            </button>
          )}
          <button onClick={onClose} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', cursor: 'pointer' }}>Zapri</button>
        </div>
      </div>
    </div>
  )
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Lead | null>(null)
  const [emailLead, setEmailLead] = useState<Lead | null>(null)

  if (leads.length === 0) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Ni organic leads</p>
        <p style={{ fontSize: '13px' }}>Leadi se bodo pojavili ko bodo stranke končale pogovor z Vero.</p>
      </div>
    )
  }

  return (
    <>
      {selected && <ConversationModal lead={selected} onClose={() => setSelected(null)} />}
      {emailLead && <EmailModal lead={emailLead} onClose={() => setEmailLead(null)} />}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Ime', 'Podjetje', 'Email', 'Panoga', 'Baza', 'Paket', 'ROI €/mes', 'Status', 'GDPR', 'Čas', 'Chat', 'Pošlji'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left',
                fontSize: '11px', fontWeight: 600, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((l, i) => {
            const st = STATUS_LABELS[l.status ?? 'new'] ?? STATUS_LABELS['new']
            const msgCount = Array.isArray(l.conversation_log) ? l.conversation_log.length : 0
            return (
              <tr key={l.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap' }}>{l.contact_name}</td>
                <td style={{ padding: '10px 14px', color: '#0f172a', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.company_name}</td>
                <td style={{ padding: '10px 14px' }}>
                  <a href={`mailto:${l.email}`} style={{ color: cobalt, textDecoration: 'none' }}>{l.email}</a>
                </td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>{INDUSTRY_LABELS[l.industry ?? ''] ?? l.industry ?? '—'}</td>
                <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{l.estimated_contacts ?? '—'}</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>{l.recommended_package ?? '—'}</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: navy, whiteSpace: 'nowrap' }}>
                  {l.estimated_roi_eur ? `${Number(l.estimated_roi_eur).toLocaleString('sl-SI')} €` : '—'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    background: st.bg, color: st.color,
                    fontSize: '11px', fontWeight: 600,
                    padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap',
                  }}>{st.label}</span>
                </td>
                <td style={{ padding: '10px 14px', color: l.gdpr_consent ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                  {l.gdpr_consent ? '✓' : '✗'}
                </td>
                <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {l.created_at ? new Date(l.created_at).toLocaleString('sl-SI', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <button
                    onClick={() => setSelected(l)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: msgCount > 0 ? '#EEF2FF' : '#f1f5f9',
                      color: msgCount > 0 ? cobalt : '#94a3b8',
                      border: 'none', borderRadius: '6px',
                      padding: '5px 10px', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M11 6.5C11 9.09 8.87 11 6 11C4.85 11 3.76 10.62 2.82 9.95L1 11L1.78 9.18C1.28 8.24 1 7.15 1 6C1 3.41 3.69 1.5 6 1.5C8.31 1.5 11 3.41 11 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {msgCount > 0 ? `${msgCount} sporočil` : 'Prazno'}
                  </button>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <button
                    onClick={() => setEmailLead(l)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: l.email_sent_at ? '#f0fdf4' : (l.email_draft ? '#ECFDF5' : '#f1f5f9'),
                      color: l.email_sent_at ? green : (l.email_draft ? green : '#94a3b8'),
                      border: 'none', borderRadius: '6px',
                      padding: '5px 10px', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    {l.email_sent_at ? '✓ Poslano' : (l.email_draft ? 'Pošlji →' : '—')}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
