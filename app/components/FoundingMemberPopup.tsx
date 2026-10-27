'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'founding_popup_dismissed'
const DELAY_MS = 30_000

export default function FoundingMemberPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch { /* ignore */ }

    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
  }

  if (!visible) return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFBF5',
          border: '2px solid #D97706',
          borderRadius: '20px',
          padding: '36px 32px',
          maxWidth: '520px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#92400E', fontSize: '20px', lineHeight: 1, padding: '4px',
          }}
        >
          ✕
        </button>

        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#B45309', textTransform: 'uppercase' }}>
            Founding Member — 10 Spots Only
          </span>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#78350F', lineHeight: 1.2, marginBottom: '12px' }}>
          PRO Trading at 1,990&nbsp;€/year.<br />Locked in forever.
        </h2>

        <p style={{ fontSize: '14px', color: '#92400E', lineHeight: 1.6, marginBottom: '20px' }}>
          PRO Trading normally costs 2,490&nbsp;€/year. The first 10 companies get the founding price — permanently. Price never goes up for you, as long as you stay subscribed.
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            'CBAM + ETS compliance tools',
            'OTC bulletin board — the only one in the EU',
            'ETS cost tracker with MSR alerts',
            'EFET contract auto-generation',
            'Priority support',
          ].map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#78350F' }}>
              <span style={{ color: '#D97706', fontWeight: 700 }}>✓</span> {f}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href="/pricing"
            onClick={dismiss}
            style={{
              background: '#B45309', color: 'white',
              padding: '13px 28px', borderRadius: '10px',
              fontSize: '15px', fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            Claim founding spot →
          </Link>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#78350F' }}>1,990 €<span style={{ fontSize: '13px', fontWeight: 500 }}>/year</span></div>
            <div style={{ fontSize: '12px', color: '#B45309', textDecoration: 'line-through' }}>2,490 €/year regular</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706' }}>You save 500 €</div>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#B45309', marginTop: '14px', opacity: 0.7 }}>
          Starts with 30-day free trial. No credit card required.
        </p>
      </div>
    </div>
  )
}
