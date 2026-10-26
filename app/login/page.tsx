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

  useEffect(() => {
    refreshCaptcha()
  }, [refreshCaptcha])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError('Wrong answer — try the math question again.')
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
      setError(data.error ?? 'Login failed')
      refreshCaptcha()
      setLoading(false)
      return
    }

    // Refresh session in browser
    await supabase.auth.signInWithPassword({ email, password })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#FFFBF3]">
      {/* Minimal nav */}
      <nav style={{ background: 'rgba(255,251,243,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/carbonis-logo-light.png" alt="Carbonis" style={{ height: '28px', width: 'auto' }}/>
        </Link>
        <Link href="/" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>← Back to home</Link>
      </nav>

      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-gray-500 mt-1 text-sm">EU Environmental Compliance</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF] focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {/* Math CAPTCHA */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security check: {captcha.a} + {captcha.b} = ?
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  required
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
                  placeholder="?"
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2"
                >
                  New question
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2471] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a1f63] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <Link href="/register" className="text-[#265CFF] hover:underline">
              Start free trial
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}
