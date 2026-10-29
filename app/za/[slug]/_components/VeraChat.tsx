'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface VeraChatProps {
  prospectContext: string
  companyName: string
}

export default function VeraChat({ prospectContext, companyName }: VeraChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoOpened, setAutoOpened] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-open after 4s with greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!autoOpened) {
        setAutoOpened(true)
        setOpen(true)
        setMessages([{
          role: 'assistant',
          content: `Pozdravljeni! Sem Vera iz Carbonis.\n\nOpazila sem, da ste si ogledali analizo za ${companyName}. Sem tukaj, če imate kakršnakoli vprašanja — o tem, kar smo ugotovili, o naših storitvah ali o tem, kako bi vam lahko pomagali.\n\nKaj vas zanima?`
        }])
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [autoOpened, companyName])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/vera/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          prospectContext,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Network error')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const { text } = JSON.parse(payload) as { text: string }
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                role: 'assistant',
                content: updated[updated.length - 1].content + text,
              }
              return updated
            })
          } catch { /* ignore parse errors */ }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Oprostite, prišlo je do napake. Poskusite znova.' }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => { setOpen(true); if (messages.length === 0) { setMessages([{ role: 'assistant', content: `Pozdravljeni! Sem Vera iz Carbonis. Sem tukaj za vsa vprašanja o analizi in naših storitvah. Kaj vas zanima?` }]) } }}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
            background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '50px',
            padding: '14px 20px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 20px rgba(29,78,216,0.4)',
          }}
        >
          <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
          Vprašajte Vero
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '16px', right: '16px', zIndex: 50,
          width: '360px', maxWidth: 'calc(100vw - 32px)',
          background: 'white', borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '520px',
        }}>
          {/* Header */}
          <div style={{ background: '#0f2d5a', borderRadius: '16px 16px 0 0', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', background: '#1d4ed8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: 'white' }}>V</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Vera</div>
                <div style={{ color: '#93c5fd', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                  Na voljo zdaj
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#93c5fd', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '200px', maxHeight: '340px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: m.role === 'user' ? '#1d4ed8' : '#f1f5f9',
                  color: m.role === 'user' ? 'white' : '#1e293b',
                  fontSize: '13px', lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                  {loading && i === messages.length - 1 && m.role === 'assistant' && m.content === '' && (
                    <span style={{ opacity: 0.5 }}>Pišem…</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Napišite sporočilo…"
              disabled={loading}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '8px',
                border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none',
                background: loading ? '#f8fafc' : 'white',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#e2e8f0' : '#1d4ed8',
                color: loading || !input.trim() ? '#94a3b8' : 'white',
                border: 'none', borderRadius: '8px', padding: '10px 14px',
                fontSize: '16px', cursor: loading || !input.trim() ? 'default' : 'pointer',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
