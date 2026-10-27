'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface KnowledgeEntry {
  id: string
  question: string
  answer: string
  category: string
  is_active: boolean
  created_at: string
}

interface Conversation {
  id: string
  session_id: string
  user_id: string | null
  messages: Array<{ role: string; content: string }>
  created_at: string
  updated_at: string
}

interface Props {
  knowledge: KnowledgeEntry[]
  conversations: Conversation[]
}

const CATEGORIES = ['general', 'pricing', 'features', 'onboarding', 'technical']

export default function NaviAdminClient({ knowledge: initial, conversations }: Props) {
  const [tab, setTab] = useState<'kb' | 'conversations'>('kb')
  const [knowledge, setKnowledge] = useState(initial)
  const [editing, setEditing] = useState<KnowledgeEntry | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '', category: 'general' })
  const [saving, setSaving] = useState(false)
  const [expandedConv, setExpandedConv] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function toggleActive(entry: KnowledgeEntry) {
    const { data } = await supabase
      .from('navi_knowledge')
      .update({ is_active: !entry.is_active })
      .eq('id', entry.id)
      .select()
      .single()
    if (data) setKnowledge(prev => prev.map(k => k.id === entry.id ? data : k))
  }

  async function saveEntry() {
    if (!form.question.trim() || !form.answer.trim()) return
    setSaving(true)
    if (editing) {
      const { data } = await supabase
        .from('navi_knowledge')
        .update({ question: form.question, answer: form.answer, category: form.category })
        .eq('id', editing.id)
        .select()
        .single()
      if (data) setKnowledge(prev => prev.map(k => k.id === editing.id ? data : k))
      setEditing(null)
    } else {
      const { data } = await supabase
        .from('navi_knowledge')
        .insert({ question: form.question, answer: form.answer, category: form.category })
        .select()
        .single()
      if (data) setKnowledge(prev => [...prev, data])
      setCreating(false)
    }
    setForm({ question: '', answer: '', category: 'general' })
    setSaving(false)
  }

  async function deleteEntry(id: string) {
    if (!confirm('Delete this knowledge entry?')) return
    await supabase.from('navi_knowledge').delete().eq('id', id)
    setKnowledge(prev => prev.filter(k => k.id !== id))
  }

  function startEdit(entry: KnowledgeEntry) {
    setEditing(entry)
    setCreating(false)
    setForm({ question: entry.question, answer: entry.answer, category: entry.category })
  }

  function cancelEdit() {
    setEditing(null)
    setCreating(false)
    setForm({ question: '', answer: '', category: 'general' })
  }

  const grouped = CATEGORIES.reduce<Record<string, KnowledgeEntry[]>>((acc, cat) => {
    acc[cat] = knowledge.filter(k => k.category === cat)
    return acc
  }, {})

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0B1F4B' }}>Navi AI</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Knowledge base management &amp; conversation history</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
        {(['kb', 'conversations'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#0B1F4B' : '#64748b',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t === 'kb' ? `Knowledge Base (${knowledge.length})` : `Conversations (${conversations.length})`}
          </button>
        ))}
      </div>

      {/* KB tab */}
      {tab === 'kb' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => { setCreating(true); setEditing(null); setForm({ question: '', answer: '', category: 'general' }) }}
              style={{ padding: '8px 16px', background: '#0B1F4B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              + Add entry
            </button>
          </div>

          {/* Form */}
          {(creating || editing) && (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0B1F4B', marginBottom: '14px' }}>
                {editing ? 'Edit entry' : 'New entry'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '7px 10px', fontSize: '13px', color: '#0f172a', background: 'white' }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Question</label>
                  <input
                    value={form.question}
                    onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', fontSize: '13px', boxSizing: 'border-box' }}
                    placeholder="What question does this answer?"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Answer</label>
                  <textarea
                    value={form.answer}
                    onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                    rows={4}
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                    placeholder="The answer Navi will use (plain text, max ~200 words)"
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={saveEntry}
                    disabled={saving}
                    style={{ padding: '8px 16px', background: '#265CFF', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{ padding: '8px 16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '7px', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entries by category */}
          {CATEGORIES.map(cat => {
            const entries = grouped[cat]
            if (entries.length === 0) return null
            return (
              <div key={cat} style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{cat}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {entries.map(entry => (
                    <div
                      key={entry.id}
                      style={{
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px',
                        opacity: entry.is_active ? 1 : 0.5,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F4B', marginBottom: '4px' }}>{entry.question}</p>
                          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{entry.answer}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button
                            onClick={() => toggleActive(entry)}
                            style={{
                              padding: '4px 10px', borderRadius: '5px', border: '1px solid', fontSize: '11px', cursor: 'pointer', fontWeight: 500,
                              background: entry.is_active ? '#dcfce7' : '#f1f5f9',
                              color: entry.is_active ? '#16a34a' : '#94a3b8',
                              borderColor: entry.is_active ? '#bbf7d0' : '#e2e8f0',
                            }}
                          >
                            {entry.is_active ? 'Active' : 'Off'}
                          </button>
                          <button
                            onClick={() => startEdit(entry)}
                            style={{ padding: '4px 10px', borderRadius: '5px', border: '1px solid #e2e8f0', fontSize: '11px', cursor: 'pointer', background: '#f8fafc', color: '#64748b' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            style={{ padding: '4px 10px', borderRadius: '5px', border: '1px solid #fecaca', fontSize: '11px', cursor: 'pointer', background: '#fff5f5', color: '#dc2626' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Conversations tab */}
      {tab === 'conversations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {conversations.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>No conversations yet.</p>
          )}
          {conversations.map(conv => (
            <div key={conv.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedConv(expandedConv === conv.id ? null : conv.id)}
                style={{
                  width: '100%', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0B1F4B' }}>
                    {conv.user_id ? `User ${conv.user_id.slice(0, 8)}…` : 'Anonymous'}
                    <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '8px' }}>{conv.session_id.slice(0, 20)}…</span>
                  </p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    {conv.messages.length} messages · {new Date(conv.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{expandedConv === conv.id ? '▲' : '▼'}</span>
              </button>
              {expandedConv === conv.id && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {conv.messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '75%', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', lineHeight: 1.5,
                        background: msg.role === 'user' ? '#265CFF' : '#f8fafc',
                        color: msg.role === 'user' ? 'white' : '#0B1F4B',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
