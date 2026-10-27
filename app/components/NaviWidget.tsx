'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_REPLIES = [
  "What's included in PRO?",
  'How does XML export work?',
  'Is there a free trial?',
  'How does OTC trading work?',
]

function getOrCreateSessionId(): string {
  try {
    const stored = sessionStorage.getItem('navi_session')
    if (stored) return stored
    const id = `navi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem('navi_session', id)
    return id
  } catch {
    return `navi_${Date.now()}`
  }
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '12px 14px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#94a3b8',
            animation: 'navi-bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function NaviWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const sessionId = useRef(getOrCreateSessionId())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150)
  }, [isOpen])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return
    setShowQuickReplies(false)
    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionId.current,
          history: messages.slice(-6),
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream error')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        // Parse SSE chunks from Anthropic stream
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data) as { type?: string; delta?: { type?: string; text?: string } }
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              const chunk = parsed.delta.text ?? ''
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + chunk,
                }
                return updated
              })
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }, [isStreaming, messages])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <>
      <style>{`
        @keyframes navi-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      {/* Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Navi support chat"
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
            height: '48px', borderRadius: '24px',
            background: '#0B1F4B', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '0 18px 0 14px',
            boxShadow: '0 4px 20px rgba(11,31,75,0.35)',
            transition: 'box-shadow 0.2s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.boxShadow = '0 0 0 3px rgba(38,92,255,0.25), 0 4px 20px rgba(11,31,75,0.35)'
            b.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.boxShadow = '0 4px 20px rgba(11,31,75,0.35)'
            b.style.transform = 'scale(1)'
          }}
        >
          {/* Compass/chat icon */}
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="13" cy="13" r="11" stroke="white" strokeWidth="1.5"/>
            <circle cx="13" cy="13" r="2" fill="white"/>
            <path d="M13 4v3M13 19v3M4 13h3M19 13h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 9l2.5 2.5M14.5 14.5L17 17" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
            Ask Navi
          </span>
          {/* Pulse dot */}
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80',
            flexShrink: 0, marginLeft: '2px',
            boxShadow: '0 0 0 2px rgba(74,222,128,0.3)',
          }} />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            ...(isMobile
              ? { inset: 0, borderRadius: 0 }
              : { bottom: '24px', right: '24px', width: '380px', maxHeight: '520px', borderRadius: '16px' }),
            zIndex: 50,
            background: 'white',
            boxShadow: '0 8px 40px rgba(11,31,75,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ background: '#0B1F4B', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="11" stroke="white" strokeWidth="1.5"/>
                  <circle cx="13" cy="13" r="2" fill="white"/>
                  <path d="M13 4v3M13 19v3M4 13h3M19 13h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>Navi</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px', lineHeight: 0 }}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Welcome */}
            {messages.length === 0 && (
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#0B1F4B', lineHeight: 1.5 }}>
                Hi — I&apos;m <strong>Navi</strong>. Ask me anything about the Carbonis platform — features, pricing, or how to get started.
              </div>
            )}

            {/* Quick replies */}
            {showQuickReplies && messages.length === 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                      padding: '5px 12px', fontSize: '12px', color: '#265CFF', cursor: 'pointer',
                      fontWeight: 500, transition: 'border-color 0.15s',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 13px',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === 'user' ? '#265CFF' : '#F8FAFC',
                    color: msg.role === 'user' ? 'white' : '#0B1F4B',
                    fontSize: '13px',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content || (isStreaming && i === messages.length - 1 ? <TypingDots /> : '')}
                </div>
              </div>
            ))}

            {/* Typing indicator when streaming but no content yet */}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex' }}>
                <div style={{ background: '#F8FAFC', borderRadius: '12px 12px 12px 2px' }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Carbonis…"
                disabled={isStreaming}
                style={{
                  flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px',
                  padding: '9px 12px', fontSize: '13px', outline: 'none',
                  color: '#0f172a', background: isStreaming ? '#f8fafc' : 'white',
                }}
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                  background: isStreaming || !input.trim() ? '#e2e8f0' : '#265CFF',
                  cursor: isStreaming || !input.trim() ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M9 3l5 5-5 5" stroke={isStreaming || !input.trim() ? '#94a3b8' : 'white'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '10px', color: '#cbd5e1', marginTop: '6px' }}>
              Navi · Carbonis platform support
            </p>
          </div>
        </div>
      )}
    </>
  )
}
