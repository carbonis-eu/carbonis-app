'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  return { a, b, answer: a + b }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #D1D9E6',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#172033',
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
  }, [])

  useEffect(() => { refreshCaptcha() }, [refreshCaptcha])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError('Napačen odgovor — poskusite znova.')
      refreshCaptcha()
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Prijava ni uspela.')
      refreshCaptcha()
      setLoading(false)
      return
    }

    await supabase.auth.signInWithPassword({ email, password })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F8F7' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #E3EAE8', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <img src="/carbonis-logo.png" alt="Carbonis" style={{ height: '40px', width: 'auto' }}/>
        </Link>
        <Link href="/" style={{ fontSize: '13px', color: '#687985' }}>← Nazaj na domačo stran</Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#17364D', margin: '0 0 8px' }}>Prijavite se</h1>
            <p style={{ fontSize: '14px', color: '#687985', margin: 0 }}>Dobrodošli nazaj v Carbonis</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E3EAE8', padding: '32px', boxShadow: '0 2px 16px rgba(23,54,77,0.06)' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#172033', marginBottom: '6px' }}>
                  E-poštni naslov
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="vas@podjetje.si"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#172033', marginBottom: '6px' }}>
                  Geslo
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ background: '#F5F8F7', borderRadius: '10px', padding: '14px 16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#172033', marginBottom: '8px' }}>
                  Varnostno vprašanje: {captcha.a} + {captcha.b} = ?
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    required
                    style={{ ...inputStyle, width: '80px' }}
                    placeholder="?"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    style={{ fontSize: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    Novo vprašanje
                  </button>
                </div>
              </div>

              {error && (
                <p style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#6b7280' : '#1E7A56',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '14px', fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: '4px',
                }}
              >
                {loading ? 'Prijavljam...' : 'Prijavite se'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#687985', marginTop: '24px', marginBottom: 0 }}>
              Še nimate računa?{' '}
              <Link href="/register" style={{ color: '#1E7A56', fontWeight: 600 }}>Začnite brezplačno</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
