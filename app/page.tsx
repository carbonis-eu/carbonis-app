export const instant = false

import Link from 'next/link'

async function getEtsPrice(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/ets-price`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      return data.price ?? 65.40
    }
  } catch { /* fallback */ }
  return 65.40
}

export default async function HomePage() {
  const etsPrice = await getEtsPrice()

  return (
    <div className="min-h-screen bg-[#FFFBF3]">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 4s ease-in-out infinite; }
        .card-tilt { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-tilt:hover {
          transform: perspective(800px) rotateX(-3deg) rotateY(4deg) scale(1.02);
          box-shadow: 0 20px 50px rgba(11,36,113,0.12);
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slide-up 0.6s ease-out both; }
        .slide-up-2 { animation: slide-up 0.6s 0.15s ease-out both; }
        .slide-up-3 { animation: slide-up 0.6s 0.3s ease-out both; }
      `}</style>

      {/* NAV */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#0B2471]">Carbonis</span>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link
              href="/register"
              className="bg-[#0B2471] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0a1f63] transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full mb-8 slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          CBAM in force since Jan 2026 — 2026 annual declaration due May 2027
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6 slide-up-2">
          Stop guessing your<br />
          <span className="text-[#265CFF]">CBAM liability</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 slide-up-3">
          Calculate your carbon border adjustment costs, source smarter across 20+ countries,
          and generate audit-ready CBAM declarations — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 slide-up-3">
          <Link
            href="/register"
            className="bg-[#0B2471] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#0a1f63] transition-colors shadow-lg shadow-blue-900/20"
          >
            Start free 30-day trial
          </Link>
          <Link
            href="/cbam"
            className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl text-sm font-semibold hover:border-gray-400 hover:bg-white transition-colors"
          >
            Try CBAM calculator — free →
          </Link>
        </div>

        {/* ETS live price badge */}
        <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-500">EU ETS today</span>
          <span className="font-bold text-[#0B2471] text-lg">€{etsPrice.toFixed(2)}</span>
          <span className="text-gray-400">/ tCO₂</span>
        </div>

        {/* Mockup card — 3D float */}
        <div className="mt-16 float">
          <div className="bg-gradient-to-br from-[#0B2471] to-[#265CFF] rounded-2xl p-6 max-w-sm mx-auto text-white text-left shadow-2xl shadow-blue-900/30"
            style={{ transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' }}>
            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">CBAM Liability Estimate</p>
            <p className="text-3xl font-bold mb-3">€ 47,580</p>
            <div className="space-y-1 text-sm text-blue-100">
              <div className="flex justify-between">
                <span>500 t crude steel (BOF)</span>
                <span>China</span>
              </div>
              <div className="flex justify-between">
                <span>945 tCO₂ × €{etsPrice.toFixed(0)}/tCO₂</span>
                <span className="text-green-300">−€4,725 credit</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-400/40 flex justify-between items-center">
              <span className="text-blue-200 text-xs">Net liability</span>
              <span className="font-bold">€ 47,580</span>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINT BANNER */}
      <section className="bg-[#0B2471] py-10">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <p className="text-lg font-medium mb-2">
            Non-compliance with CBAM carries fines of <span className="text-yellow-300 font-bold">€50–€150 per tCO₂</span> of unreported emissions
          </p>
          <p className="text-blue-300 text-sm">
            Regulation (EU) 2023/956 — in force for cement, steel, aluminium, fertilisers, hydrogen & electricity
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need for CBAM compliance</h2>
          <p className="text-gray-500">Built for EU importers, traders, and compliance managers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🧮',
              title: 'CBAM Calculator',
              desc: 'Free, no registration. Instant liability estimates for 20+ products across 6 CBAM sectors. Live EU ETS price, country-specific emission factors, procurement comparison.',
              badge: 'Free',
              href: '/cbam',
            },
            {
              icon: '📋',
              title: 'Certificate Marketplace',
              desc: 'OTC bulletin board for CBAM and GO certificates. Sellers list for free. Buyers get matched automatically. EFET contract generated on match.',
              badge: 'Coming Q1 2027',
              href: '/register',
            },
            {
              icon: '📊',
              title: 'Compliance Reports',
              desc: 'Generate CBAM XML declarations ready for the EU CBAM Registry. ARSO and DEHSt formats. Audit trail and submission history included.',
              badge: 'PRO Compliance',
              href: '/register',
            },
          ].map(f => (
            <Link key={f.title} href={f.href} className="card-tilt bg-white rounded-2xl border border-gray-200 p-6 block">
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <span className="text-xs bg-blue-50 text-[#265CFF] px-2 py-0.5 rounded-full">{f.badge}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Up and running in minutes</h2>
            <p className="text-gray-500">No consultants. No spreadsheets. No guessing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Register your company', desc: 'Sign up with your EU VAT number. 30-day free trial, no credit card.' },
              { n: '02', title: 'Enter your imports', desc: 'Select CN code, country of origin, quantity. We handle the emission factors.' },
              { n: '03', title: 'Get your declaration', desc: 'Download audit-ready CBAM XML report or export to your compliance workflow.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0B2471] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h2>
          <p className="text-gray-500">Seller tier is free forever. Compliance and trading plans include a 30-day free trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Seller',
              price: '€0',
              period: 'forever',
              features: [
                'Post CBAM & GO certificate listings',
                'VAT/VIES verified profile',
                'View counter on your listings',
                'EFET contract generated on match',
                'No commission — ever',
              ],
              cta: 'Register as seller',
              href: '/register',
              highlight: false,
            },
            {
              name: 'PRO Compliance',
              price: '€79',
              period: '/month',
              features: [
                'Unlimited CBAM calculations',
                'Compliance dashboard',
                'XML/PDF export (ARSO, DEHSt)',
                'AI cost forecast',
                'Supplier data request link',
                '30-day free trial',
              ],
              cta: 'Start free trial',
              href: '/register',
              highlight: true,
            },
            {
              name: 'PRO Trading',
              price: '€249',
              period: '/month',
              features: [
                'Everything in PRO Compliance',
                'OTC bulletin board (CBAM + GO)',
                'Automated match alerts',
                'MSR / EUA price alerts',
                'EU Sanctions screening',
                '30-day free trial',
              ],
              cta: 'Start free trial',
              href: '/register',
              highlight: false,
            },
          ].map(p => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 flex flex-col ${p.highlight ? 'bg-[#0B2471] border-[#0B2471] text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              <div className="mb-6">
                <p className={`text-sm font-medium mb-1 ${p.highlight ? 'text-blue-300' : 'text-gray-500'}`}>{p.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className={`text-sm ${p.highlight ? 'text-blue-300' : 'text-gray-400'}`}>{p.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <span className={`text-xs ${p.highlight ? 'text-green-400' : 'text-green-500'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  p.highlight
                    ? 'bg-white text-[#0B2471] hover:bg-blue-50'
                    : 'bg-[#0B2471] text-white hover:bg-[#0a1f63]'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Regulation', value: 'EU 2023/956' },
              { label: 'Data hosting', value: 'EU (Supabase)' },
              { label: 'CBAM sectors', value: '6 covered' },
              { label: 'Countries', value: '20+ supported' },
            ].map(t => (
              <div key={t.label}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t.label}</p>
                <p className="font-semibold text-gray-800">{t.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B2471] text-blue-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div>
            <p className="text-white font-bold text-lg mb-1">Carbonis</p>
            <p>EU Environmental Compliance Marketplace</p>
            <p className="mt-1">carbonis.eu</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-white font-medium mb-2">Platform</p>
              <div className="space-y-1">
                <Link href="/cbam" className="block hover:text-white transition-colors">CBAM Calculator</Link>
                <Link href="/register" className="block hover:text-white transition-colors">Register</Link>
                <Link href="/login" className="block hover:text-white transition-colors">Sign in</Link>
              </div>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Legal</p>
              <div className="space-y-1">
                <span className="block">Privacy Policy</span>
                <span className="block">Terms of Service</span>
                <span className="block">GDPR</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-blue-800 text-xs text-blue-400">
          © 2026 Carbonis. Not legal or tax advice. EU Regulation 2023/956 compliance is the responsibility of the declarant.
        </div>
      </footer>
    </div>
  )
}
