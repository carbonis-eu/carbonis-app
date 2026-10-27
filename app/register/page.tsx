'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Role = 'buyer' | 'seller' | 'compliance'

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: 'buyer', label: 'Certificate Buyer', description: 'I need to purchase CBAM, GO or EUA certificates' },
  { value: 'seller', label: 'Certificate Seller', description: 'I have surplus certificates to sell (free)' },
  { value: 'compliance', label: 'Compliance Only', description: 'I need CBAM/ETS compliance tools & reports' },
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
  const [vatNumber, setVatNumber] = useState('')
  const [role, setRole] = useState<Role>('buyer')
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError('Wrong answer — try the math question again.')
      refreshCaptcha()
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company_name: companyName, vat_number: vatNumber, role },
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
        vat_number: vatNumber,
        role,
        tier: role === 'seller' ? 'seller' : 'free',
      }).eq('id', user.id)
    }

    router.push('/dashboard?welcome=1')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Minimal nav */}
      <nav style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/carbonis-logo.png" alt="Carbonis" style={{ height: '32px', width: 'auto' }}/>
        </Link>
        <Link href="/" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>← Back to home</Link>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-gray-500 mt-1 text-sm">30-day free trial — no credit card required</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create account</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="space-y-2">
                {ROLE_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      role === opt.value
                        ? 'border-[#265CFF] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={role === opt.value}
                      onChange={() => setRole(opt.value)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
                placeholder="Acme d.o.o."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT number</label>
              <input
                type="text"
                value={vatNumber}
                onChange={e => setVatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
                placeholder="SI12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
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
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#265CFF]"
                placeholder="Min. 8 characters"
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
              {loading ? 'Creating account...' : 'Start free trial'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#265CFF] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}
