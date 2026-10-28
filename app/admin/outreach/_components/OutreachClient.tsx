'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Prospect {
  id: string
  company_name: string
  country: string
  sector?: string | null
  contact_email?: string | null
  contact_name?: string | null
  estimated_surplus?: number | null
  language?: string
  status: string
  email_sent_at?: string | null
  email_subject?: string | null
  notes?: string | null
  source?: string
  created_at: string
  crm_activity?: Array<{ id: string; type: string; created_at: string }>
}

interface Subscriber {
  id: string
  email: string
  name?: string | null
  country?: string | null
  source?: string | null
  status: string
  subscribed_at: string
}

interface Props {
  prospects: Prospect[]
  subscribers: Subscriber[]
}

const STATUS_COLORS: Record<string, [string, string]> = {
  new:            ['#f1f5f9', '#475569'],
  email_sent:     ['#eff6ff', '#1d4ed8'],
  responded:      ['#f0fdf4', '#15803d'],
  interested:     ['#fefce8', '#854d0e'],
  not_interested: ['#fee2e2', '#dc2626'],
  converted:      ['#f0fdf4', '#15803d'],
}

const SECTORS = ['iron_steel', 'cement', 'aluminium', 'fertilisers', 'hydrogen', 'electricity', 'other']
const LANGUAGES = [{ v: 'sl', l: 'SLO' }, { v: 'de', l: 'DE' }, { v: 'en', l: 'EN' }, { v: 'pl', l: 'PL' }]
const COUNTRIES = ['SI', 'DE', 'PL', 'AT', 'HR', 'CZ', 'HU', 'RO', 'IT', 'FR']

export default function OutreachClient({ prospects: initial, subscribers }: Props) {
  const [tab, setTab] = useState<'prospects' | 'subscribers'>('prospects')
  const [prospects, setProspects] = useState(initial)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Prospect | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ company_name: '', country: 'SI', contact_email: '', contact_name: '', sector: '', language: 'sl', estimated_surplus: '', notes: '', source: 'manual', type: 'supply' as 'supply' | 'demand' })
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null)
  const [statusUpdate, setStatusUpdate] = useState('')
  const [noteText, setNoteText] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const filtered = prospects.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter
    const matchSearch = !search || p.company_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.contact_email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.country ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  async function addProspect() {
    if (!form.company_name || !form.country) return
    const { data } = await supabase.from('outreach_prospects').insert({
      company_name: form.company_name, country: form.country,
      contact_email: form.contact_email || null, contact_name: form.contact_name || null,
      sector: form.sector || null, language: form.language,
      estimated_surplus: form.estimated_surplus ? Number(form.estimated_surplus) : null,
      notes: form.notes || null, source: form.source, status: 'new',
    }).select().single()
    if (data) {
      setProspects(p => [{ ...data, crm_activity: [] }, ...p])
      setAdding(false)
      setForm({ company_name: '', country: 'SI', contact_email: '', contact_name: '', sector: '', language: 'sl', estimated_surplus: '', notes: '', source: 'manual', type: 'supply' })
    }
  }

  async function generateEmail(p: Prospect, emailType: 'supply' | 'demand' = 'supply') {
    setGenerating(true)
    setEmailDraft(null)
    try {
      const res = await fetch('/api/admin/outreach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: p.company_name, language: p.language ?? 'sl',
          sector: p.sector, estimated_surplus: p.estimated_surplus, type: emailType,
        }),
      })
      const data = await res.json()
      if (data.subject) setEmailDraft({ subject: data.subject, body: data.body })
    } finally {
      setGenerating(false)
    }
  }

  async function sendEmail(p: Prospect) {
    if (!emailDraft || !p.contact_email) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect_id: p.id, subject: emailDraft.subject, body: emailDraft.body, language: p.language ?? 'sl' }),
      })
      if (res.ok) {
        setProspects(prev => prev.map(x => x.id === p.id ? { ...x, status: 'email_sent', email_sent_at: new Date().toISOString(), email_subject: emailDraft.subject } : x))
        if (selected?.id === p.id) setSelected(s => s ? { ...s, status: 'email_sent', email_sent_at: new Date().toISOString() } : s)
        setEmailDraft(null)
      }
    } finally {
      setSending(false)
    }
  }

  async function updateStatus(p: Prospect, status: string) {
    await supabase.from('outreach_prospects').update({ status, updated_at: new Date().toISOString() }).eq('id', p.id)
    setProspects(prev => prev.map(x => x.id === p.id ? { ...x, status } : x))
    if (selected?.id === p.id) setSelected(s => s ? { ...s, status } : s)
  }

  async function addNote(p: Prospect) {
    if (!noteText.trim()) return
    await supabase.from('crm_activity').insert({ prospect_id: p.id, type: 'note', notes: noteText })
    await supabase.from('outreach_prospects').update({ notes: noteText, updated_at: new Date().toISOString() }).eq('id', p.id)
    setProspects(prev => prev.map(x => x.id === p.id ? { ...x, notes: noteText } : x))
    if (selected?.id === p.id) setSelected(s => s ? { ...s, notes: noteText } : s)
    setNoteText('')
  }

  const stats = [
    { label: 'Skupaj', value: prospects.length, color: '#0B1F4B' },
    { label: 'Novo', value: prospects.filter(p => p.status === 'new').length, color: '#475569' },
    { label: 'Poslano', value: prospects.filter(p => p.status === 'email_sent').length, color: '#1d4ed8' },
    { label: 'Odgovorili', value: prospects.filter(p => p.status === 'responded').length, color: '#15803d' },
    { label: 'Zainteresirani', value: prospects.filter(p => p.status === 'interested').length, color: '#854d0e' },
    { label: 'Pretvorjeni', value: prospects.filter(p => p.status === 'converted').length, color: '#16a34a' },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0B1F4B', marginBottom: '4px' }}>Outreach & CRM</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Pipeline podjetij za B2B outreach — supply (prodajalci EUA) in demand (CBAM uvozniki)</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 18px', textAlign: 'center', minWidth: '80px' }}>
            <p style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{s.label}</p>
          </div>
        ))}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 18px', textAlign: 'center', minWidth: '80px' }}>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#7c3aed' }}>{subscribers.filter(s => s.status === 'active').length}</p>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>Newsletter</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#f1f5f9', borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
        {[['prospects', `Prospects (${prospects.length})`], ['subscribers', `Newsletter (${subscribers.length})`]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v as 'prospects' | 'subscribers')} style={{
            padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            background: tab === v ? 'white' : 'transparent', color: tab === v ? '#0B1F4B' : '#64748b',
            boxShadow: tab === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{l}</button>
        ))}
      </div>

      {/* PROSPECTS TAB */}
      {tab === 'prospects' && (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* LEFT: list */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Išči podjetje, email, država…"
                style={{ flex: 1, minWidth: '200px', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '13px' }}
              />
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '13px', background: 'white' }}>
                <option value="all">Vsi statusi</option>
                <option value="new">Novo</option>
                <option value="email_sent">Email poslan</option>
                <option value="responded">Odgovorili</option>
                <option value="interested">Zainteresirani</option>
                <option value="not_interested">Nezainteresirani</option>
                <option value="converted">Pretvorjeni</option>
              </select>
              <button onClick={() => setAdding(v => !v)} style={{ padding: '7px 14px', background: '#0B1F4B', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                + Dodaj
              </button>
            </div>

            {/* Add form */}
            {adding && (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0B1F4B', marginBottom: '12px' }}>Nov prospect</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    ['Podjetje *', 'company_name', 'text', 'text'],
                    ['Kontakt email *', 'contact_email', 'email', 'text'],
                    ['Kontaktna oseba', 'contact_name', 'text', 'text'],
                    ['Presežek EUA', 'estimated_surplus', 'number', 'text'],
                  ].map(([label, key, type]) => (
                    <div key={key}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>{label}</label>
                      <input type={type} value={form[key as keyof typeof form] as string}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>Država</label>
                    <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', background: 'white' }}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>Jezik emaila</label>
                    <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', background: 'white' }}>
                      {LANGUAGES.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>Sektor</label>
                    <select value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', background: 'white' }}>
                      <option value="">—</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>Tip outreach</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'supply' | 'demand' }))} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', background: 'white' }}>
                      <option value="supply">Supply (prodajalec EUA)</option>
                      <option value="demand">Demand (CBAM uvoznik)</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>Opomba</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={addProspect} style={{ padding: '7px 14px', background: '#265CFF', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Dodaj</button>
                  <button onClick={() => setAdding(false)} style={{ padding: '7px 14px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}>Prekliči</button>
                </div>
              </div>
            )}

            {/* Prospects list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filtered.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Ni prospektov. Dodaj podjetja s tipko "+ Dodaj" ali uvozi CSV iz EUTL.</p>
                </div>
              )}
              {filtered.map(p => {
                const [bg, color] = STATUS_COLORS[p.status] ?? ['#f1f5f9', '#475569']
                const isSelected = selected?.id === p.id
                return (
                  <div key={p.id} onClick={() => setSelected(isSelected ? null : p)}
                    style={{ background: 'white', border: `1px solid ${isSelected ? '#265CFF' : '#e2e8f0'}`, borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F4B' }}>{p.company_name}</p>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{p.country}</span>
                          {p.sector && <span style={{ fontSize: '10px', color: '#94a3b8', background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>{p.sector}</span>}
                        </div>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>{p.contact_email ?? '—'}</p>
                        {p.estimated_surplus && <p style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>{p.estimated_surplus.toLocaleString()} EUA surplus</p>}
                        {p.notes && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', fontStyle: 'italic' }}>{p.notes.slice(0, 80)}{p.notes.length > 80 ? '…' : ''}</p>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                        <span style={{ background: bg, color, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>{p.status.replace('_', ' ').toUpperCase()}</span>
                        {p.email_sent_at && <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(p.email_sent_at).toLocaleDateString('sl-SI')}</span>}
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{(p.crm_activity ?? []).length} aktivnosti</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT: detail panel */}
          {selected && (
            <div style={{ width: '380px', flexShrink: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky', top: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B1F4B', marginBottom: '2px' }}>{selected.company_name}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{selected.country} · {selected.contact_email ?? 'brez emaila'}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', lineHeight: 1 }}>×</button>
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '12px' }}>
                {[
                  ['Sektor', selected.sector ?? '—'],
                  ['Jezik', selected.language ?? 'sl'],
                  ['Presežek EUA', selected.estimated_surplus ? selected.estimated_surplus.toLocaleString() : '—'],
                  ['Vir', selected.source ?? 'manual'],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: '#f8fafc', borderRadius: '6px', padding: '8px 10px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>{k}</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Status changer */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>PIPELINE STATUS</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {Object.entries(STATUS_COLORS).map(([s, [bg, color]]) => (
                    <button key={s} onClick={() => updateStatus(selected, s)}
                      style={{ padding: '3px 8px', borderRadius: '4px', border: `1px solid ${selected.status === s ? '#265CFF' : '#e2e8f0'}`, fontSize: '10px', fontWeight: 600, cursor: 'pointer', background: selected.status === s ? '#265CFF' : bg, color: selected.status === s ? 'white' : color }}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email generator */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>GENERIRAJ EMAIL</p>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <button onClick={() => generateEmail(selected, 'supply')} disabled={generating || !selected.contact_email}
                    style={{ flex: 1, padding: '7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', fontWeight: 600, color: '#0B1F4B', cursor: selected.contact_email ? 'pointer' : 'not-allowed' }}>
                    {generating ? '⏳ Generiram…' : '✉ Supply (EUA seller)'}
                  </button>
                  <button onClick={() => generateEmail(selected, 'demand')} disabled={generating || !selected.contact_email}
                    style={{ flex: 1, padding: '7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', fontWeight: 600, color: '#0B1F4B', cursor: selected.contact_email ? 'pointer' : 'not-allowed' }}>
                    📋 Demand (CBAM)
                  </button>
                </div>
                {!selected.contact_email && <p style={{ fontSize: '11px', color: '#f97316' }}>⚠ Dodaj email naslov za pošiljanje</p>}

                {emailDraft && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <p style={{ fontWeight: 700, color: '#0B1F4B', fontSize: '11px' }}>ZADEVA</p>
                      <button onClick={() => setEmailDraft(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '13px' }}>×</button>
                    </div>
                    <input value={emailDraft.subject} onChange={e => setEmailDraft(d => d ? { ...d, subject: e.target.value } : d)}
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '5px 7px', fontSize: '12px', marginBottom: '8px', boxSizing: 'border-box' }} />
                    <textarea value={emailDraft.body} onChange={e => setEmailDraft(d => d ? { ...d, body: e.target.value } : d)}
                      rows={8} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '5px 7px', fontSize: '11px', lineHeight: 1.5, boxSizing: 'border-box', resize: 'vertical' }} />
                    <button onClick={() => sendEmail(selected)} disabled={sending || !selected.contact_email}
                      style={{ width: '100%', marginTop: '8px', padding: '8px', background: selected.status === 'email_sent' ? '#64748b' : '#265CFF', color: 'white', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      {sending ? '⏳ Pošiljam…' : selected.status === 'email_sent' ? '✓ Email že poslan' : `📤 Pošlji na ${selected.contact_email}`}
                    </button>
                  </div>
                )}
              </div>

              {/* Note */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>OPOMBA / CRM ZAPIS</p>
                <textarea value={noteText || selected.notes || ''} onChange={e => setNoteText(e.target.value)}
                  rows={3} placeholder="Kontaktiran 28. okt., čaka odgovor…"
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', boxSizing: 'border-box', resize: 'vertical' }} />
                <button onClick={() => addNote(selected)} style={{ marginTop: '6px', padding: '5px 12px', background: '#f1f5f9', color: '#0B1F4B', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                  Shrani opombo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NEWSLETTER TAB */}
      {tab === 'subscribers' && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Email', 'Ime', 'Država', 'Vir', 'Status', 'Datum'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Ni naročnikov. Dodaj newsletter formo na landing page.</td></tr>
              ) : subscribers.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < subscribers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 500 }}>{s.email}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{s.name ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{s.country ?? '—'}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', color: '#475569' }}>{s.source ?? 'landing'}</span></td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: s.status === 'active' ? '#f0fdf4' : '#f1f5f9', color: s.status === 'active' ? '#16a34a' : '#94a3b8', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{s.status}</span></td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>{new Date(s.subscribed_at).toLocaleDateString('sl-SI')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
