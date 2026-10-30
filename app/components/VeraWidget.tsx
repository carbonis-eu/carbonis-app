'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const navy = '#102A56'
const cobalt = '#356AE6'

const PANOGE = [
  'Avtoservis', 'Kozmetika / salon', 'Fitnes studio', 'Gostinstvo',
  'Nepremičnine', 'Ordinacija', 'Vulkanizerji', 'Serviserji & monterji',
]

const TEASER_MSGS = [
  'Pozdravljeni! 👋',
  'Sem Vera, AI pomočnica Carbonis.',
  'Koliko strank spi v vaši bazi?',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

interface LeadSignal {
  name: string
  company: string
  email: string
  industry: string
  contacts: string
  gdpr: boolean
}

function extractLeadSignal(text: string): { clean: string; lead: LeadSignal | null } {
  const match = text.match(/\[LEAD:\{([^}]*)\}\]/)
  if (!match) return { clean: text, lead: null }
  try {
    const lead = JSON.parse(`{${match[1]}}`) as LeadSignal
    const clean = text.replace(match[0], '').trim()
    return { clean, lead }
  } catch {
    return { clean: text.replace(match[0], '').trim(), lead: null }
  }
}

async function saveLead(lead: LeadSignal, conversation: Message[]) {
  const log = conversation.map(m => ({ role: m.role, content: m.content }))
  await fetch('/api/organic-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, conversation_log: log, source: 'vera_chatbot' }),
  }).catch(() => {})
}

export default function VeraWidget() {
  const [open, setOpen] = useState(false)
  const [teaserVisible, setTeaserVisible] = useState(false)
  const [teaserDismissed, setTeaserDismissed] = useState(false)
  const [teaserStep, setTeaserStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const leadSavedRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      if (!teaserDismissed && !open) setTeaserVisible(true)
    }, 2500)
    return () => clearTimeout(t)
  }, [teaserDismissed, open])

  useEffect(() => {
    if (!teaserVisible || teaserStep >= TEASER_MSGS.length - 1) return
    const t = setTimeout(() => setTeaserStep(s => s + 1), 700)
    return () => clearTimeout(t)
  }, [teaserVisible, teaserStep])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Pozdravljeni! Sem Vera, AI pomočnica Carbonis. 🤝\n\nPomagam lokalnim podjetjem razumeti, koliko strank spijo v njihovi bazi — in kako jih prebuditi.\n\nKakšna je vaša panoga?',
      }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openChat = () => {
    setOpen(true)
    setTeaserVisible(false)
    setTeaserDismissed(true)
  }

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      const res = await fetch('/api/vera/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({}))
        const errMsg = (errData as { error?: string }).error
          ?? (res.status === 503 ? 'AI je trenutno zaseden — poskusite čez minuto.' : 'Napaka pri povezavi')
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: errMsg }
          return copy
        })
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data) as { text?: string }
            if (parsed.text) {
              fullText += parsed.text
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = { role: 'assistant', content: fullText, streaming: true }
                return copy
              })
            }
          } catch { /* skip malformed chunk */ }
        }
      }

      const { clean, lead } = extractLeadSignal(fullText)
      const finalMsg: Message = { role: 'assistant', content: clean }
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = finalMsg
        return copy
      })

      if (lead && lead.gdpr && lead.email && !leadSavedRef.current) {
        leadSavedRef.current = true
        const allMessages = [...newMessages, finalMsg]
        saveLead(lead, allMessages)
      }

    } catch {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: 'Ups, prišlo je do napake. Poskusite znova.' }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes dotBlink { 0%,80%,100%{opacity:0} 40%{opacity:1} }
      `}</style>

      {/* Teaser bubble */}
      {teaserVisible && !open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 9998,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {TEASER_MSGS.slice(0, teaserStep + 1).map((msg, i) => (
            <div
              key={i}
              onClick={openChat}
              style={{
                background: 'white', borderRadius: '16px 16px 4px 16px',
                padding: '10px 16px', fontSize: '13.5px', color: navy,
                boxShadow: '0 4px 20px rgba(0,0,0,0.14)', cursor: 'pointer',
                maxWidth: '220px', lineHeight: 1.45, fontWeight: 500,
                animation: 'fadeInUp 0.25s ease',
              }}
            >{msg}</div>
          ))}
          <button
            onClick={e => { e.stopPropagation(); setTeaserVisible(false); setTeaserDismissed(true) }}
            style={{
              position: 'absolute', top: '-8px', right: '-8px',
              width: '22px', height: '22px', borderRadius: '50%',
              background: '#64748b', border: 'none', color: 'white',
              fontSize: '12px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      )}

      {/* Floating button */}
      <button
        data-vera-open
        onClick={openChat}
        aria-label="Odpri Vera AI pomočnico"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${cobalt}, #2545b8)`,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(53,106,230,0.45)',
          display: open ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" opacity="0.9"/>
          <path d="M8 10h8M8 13h5" stroke="rgba(53,106,230,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '360px', maxWidth: 'calc(100vw - 32px)',
          height: '540px', maxHeight: 'calc(100vh - 48px)',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          background: '#F7F8FA',
          animation: 'fadeInUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{
            background: navy, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #356AE6, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '15px', flexShrink: 0,
            }}>V</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: 0 }}>Vera</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', margin: 0 }}>
                AI pomočnica · {loading ? 'piše...' : 'online'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
            >×</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 12px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    background: msg.role === 'user' ? cobalt : 'white',
                    color: msg.role === 'user' ? 'white' : '#0f172a',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                    padding: '10px 14px', fontSize: '13.5px', lineHeight: 1.55,
                    boxShadow: msg.role === 'assistant' ? '0 1px 4px rgba(0,0,0,0.07)' : 'none',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.content}
                    {msg.streaming && msg.content.length === 0 && (
                      <span style={{ display: 'inline-flex', gap: '3px', verticalAlign: 'middle' }}>
                        {[0,1,2].map(j => (
                          <span key={j} style={{
                            width: '4px', height: '4px', borderRadius: '50%',
                            background: '#94a3b8', display: 'inline-block',
                            animation: `dotBlink 1.2s ease-in-out ${j * 0.2}s infinite`,
                          }}/>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                {/* Quick-reply panoge — pokaži samo po prvem sporočilu Vere, preden user odgovori */}
                {i === 0 && msg.role === 'assistant' && messages.length === 1 && !loading && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', paddingLeft: '4px' }}>
                    {PANOGE.map(p => (
                      <button key={p} onClick={() => sendMessage(p)} style={{
                        background: 'white', border: '1.5px solid #D1D9E6', borderRadius: '999px',
                        padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: '#102A56',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s',
                      }}>{p}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', background: 'white', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{
              display: 'flex', gap: '8px', alignItems: 'center',
              background: '#F7F8FA', borderRadius: '12px',
              border: '1.5px solid #D1D8E4', padding: '6px 6px 6px 14px',
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Napišite sporočilo..."
                disabled={loading}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '13.5px', color: '#0f172a', outline: 'none',
                  fontFamily: 'var(--font-inter, sans-serif)',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: input.trim() && !loading ? cobalt : '#D1D8E4',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s', flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 8L3 3l2 5-2 5 10-5z" fill={input.trim() && !loading ? 'white' : '#94a3b8'}/>
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '8px 14px', background: 'white', borderTop: '1px solid #f1f5f9', flexShrink: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
              AI asistent · EU AI Act · <a href="/politika-zasebnosti" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>Zasebnost</a>
            </p>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
              <a href="mailto:info@carbonis.eu" style={{ color: '#94a3b8' }}>info@carbonis.eu</a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
