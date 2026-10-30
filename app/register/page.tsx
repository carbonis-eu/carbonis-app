'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const INDUSTRIES = [
  'Avtoservis',
  'Kozmetika / salon',
  'Fitnes studio',
  'Gostinstvo',
  'Nepremičnine',
  'Ordinacija',
  'Drugo',
]

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  return { a, b, answer: a + b }
}

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [contacts, setContacts] = useState('')
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError('Napačen odgovor — poskusite znova.')
      refreshCaptcha()
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company_name: companyName, industry, contacts },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      refreshCaptcha()
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        company_name: companyName,
        industry,
        tier: 'free',
      }).eq('id', user.id)
    }

    router.push('/dashboard?welcome=1')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      <nav style={{
        background: 'white', borderBottom: '1px solid #E0E5ED',
        padding: '0 32px', height: '64px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/carbonis-logo.png" alt="Carbonis" style={{ height: '40px', width: 'auto' }}/>
        </Link>
        <Link href="/" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>← Nazaj na domačo stran</Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#102A56', margin: '0 0 8px' }}>
              Začnite brezplačno
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              30 dni brezplačno — brez kreditne kartice
            </p>
          </div>

          <div style={{
            background: 'white', borderRadius: '16px',
            border: '1px solid #E0E5ED', padding: '32px',
            boxShadow: '0 2px 16px rgba(16,42,86,0.06)',
          }}>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#172033', marginBottom: '6px' }}>
                  Ime podjetja
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="npr. Avtoservis Horvat d.o.o."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#172033', marginBottom: '6px' }}>
                  Panoga
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  required
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Izberite panogo...</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#172033', marginBottom: '6px' }}>
                  Koliko strank imate v bazi? <span style={{ fontWeight: 400, color: '#94a3b8' }}>(ocena)</span>
                </label>
                <select
                  value={contacts}
                  onChange={e => setContacts(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Izberite...</option>
                  <option value="do_100">Do 100</option>
                  <option value="100_300">100–300</option>
                  <option value="300_500">300–500</option>
                  <option value="500_plus">500+</option>
                </select>
              </div>

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
                  minLength={8}
                  style={inputStyle}
                  placeholder="Min. 8 znakov"
                />
              </div>

              <div style={{ background: '#F7F8FA', borderRadius: '10px', padding: '14px 16px' }}>
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
                  background: loading ? '#6b7280' : '#356AE6',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '14px', fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: '4px',
                }}
              >
                {loading ? 'Ustvarjam račun...' : 'Začnite brezplačno →'}
              </button>

              <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                Z registracijo soglašate s{' '}
                <Link href="/pogoji-uporabe" style={{ color: '#94a3b8' }}>pogoji uporabe</Link>
                {' '}in{' '}
                <Link href="/politika-zasebnosti" style={{ color: '#94a3b8' }}>politiko zasebnosti</Link>.
              </p>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '24px' }}>
            Že imate račun?{' '}
            <Link href="/login" style={{ color: '#356AE6', fontWeight: 600, textDecoration: 'none' }}>Prijavite se</Link>
          </p>
        </div>
      </div>
    </div>
  )
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
