export const instant = false

import Link from 'next/link'
import InlineCbamCalc from './components/InlineCbamCalc'
import CarbonisLogo, { CarbonisIcon } from './components/CarbonisLogo'

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

// SVG icons — inline, no external deps
const icons = {
  calculator: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="10" y2="12"/>
      <line x1="14" y1="12" x2="16" y2="12"/>
      <line x1="8" y1="16" x2="10" y2="16"/>
      <line x1="14" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  marketplace: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
    </svg>
  ),
  document: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  building: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  globe: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}


export default async function HomePage() {
  const etsPrice = await getEtsPrice()

  // Mockup card: 500t BOF steel from China — real math
  const mockQty = 500
  const mockFactor = 1.89  // BOF steel tCO₂/t
  const mockEmissions = mockQty * mockFactor  // 945 tCO₂
  const mockGross = mockEmissions * etsPrice
  const mockDeduction = mockEmissions * 7  // China €7/tCO₂
  const mockNet = Math.round(mockGross - mockDeduction)

  function fmt(n: number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFFBF3' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .float { animation: float 5s ease-in-out infinite; }
        .card-3d { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-3d:hover {
          transform: perspective(900px) rotateX(-3deg) rotateY(5deg) scale(1.015);
          box-shadow: 0 24px 48px rgba(11,36,113,0.14);
        }
        @keyframes in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .in1 { animation: in 0.55s ease-out both; }
        .in2 { animation: in 0.55s 0.12s ease-out both; }
        .in3 { animation: in 0.55s 0.24s ease-out both; }
        .dot-grid {
          background-image: radial-gradient(circle, #0B247120 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(255,251,243,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-6xl mx-auto px-6" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CarbonisLogo size="md" variant="light" />
          <div className="hidden md:flex" style={{ gap: '28px', fontSize: '14px', color: '#4b5563' }}>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-gray-900">Features</a>
            <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-gray-900">Pricing</a>
            <a href="#how" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-gray-900">How it works</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login" style={{ fontSize: '14px', color: '#374151', textDecoration: 'none' }}>Sign in</Link>
            <Link
              href="/register"
              style={{ background: '#0B2471', color: 'white', fontSize: '14px', fontWeight: 600, padding: '8px 18px', borderRadius: '10px', textDecoration: 'none' }}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — 2 column */}
      <section className="dot-grid" style={{ paddingTop: '72px', paddingBottom: '80px' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '64px', alignItems: 'center' }}>

            {/* Left column */}
            <div>
              <div className="in1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e', fontSize: '12px', fontWeight: 500, padding: '6px 14px', borderRadius: '999px', marginBottom: '28px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                CBAM in force — 2026 annual declaration due May 2027
              </div>

              <h1 className="in2" style={{ fontSize: '52px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                Know your CBAM<br />
                <span style={{ color: '#265CFF' }}>liability instantly.</span>
              </h1>

              <p className="in3" style={{ fontSize: '18px', color: '#475569', lineHeight: 1.65, marginBottom: '36px', maxWidth: '480px' }}>
                Calculate carbon border adjustment costs for EU imports,
                compare sourcing alternatives, and generate audit-ready
                declarations — in one platform built for compliance teams.
              </p>

              <div className="in3" style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <Link
                  href="/register"
                  style={{ background: '#0B2471', color: 'white', fontWeight: 700, fontSize: '15px', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(11,36,113,0.22)' }}
                >
                  Start free 30-day trial
                </Link>
                <Link
                  href="/cbam"
                  style={{ background: 'white', color: '#0B2471', fontWeight: 600, fontSize: '15px', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', border: '1.5px solid #e2e8f0' }}
                >
                  Open full calculator
                </Link>
              </div>

              {/* ETS live */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: '13px', color: '#64748b' }}>EU ETS spot</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0B2471' }}>€{etsPrice.toFixed(2)}</span>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>/ tCO₂</span>
              </div>
            </div>

            {/* Right column — inline calculator */}
            <div className="in3">
              <InlineCbamCalc etsPrice={etsPrice} />
            </div>
          </div>
        </div>
      </section>

      {/* FINE ALERT BANNER */}
      <section style={{ background: '#0B2471', padding: '28px 0' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ color: '#fbbf24' }}>{icons.alert}</span>
            <p style={{ color: 'white', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Non-compliance fines: <span style={{ color: '#fde047' }}>€50–€150 per unreported tCO₂</span>
            </p>
          </div>
          <p style={{ color: '#93c5fd', fontSize: '13px', margin: 0 }}>
            EU Regulation 2023/956 — covers cement, steel, aluminium, fertilisers, hydrogen &amp; electricity
          </p>
        </div>
      </section>

      {/* HERO MOCKUP CARD (floating, correct math) */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

            {/* Floating card */}
            <div className="float" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'linear-gradient(145deg, #0B2471, #1a3a8f)',
                borderRadius: '20px',
                padding: '28px',
                width: '340px',
                color: 'white',
                boxShadow: '0 32px 64px rgba(11,36,113,0.30)',
                transform: 'perspective(1000px) rotateX(4deg) rotateY(-6deg)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ color: '#93c5fd', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>CBAM Liability Estimate</p>
                  <span style={{ background: '#265CFF', fontSize: '10px', padding: '2px 8px', borderRadius: '999px', color: 'white' }}>LIVE</span>
                </div>
                <p style={{ fontSize: '36px', fontWeight: 800, margin: '8px 0 16px', letterSpacing: '-0.03em' }}>{fmt(mockNet)}</p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#bfdbfe', marginBottom: '8px' }}>
                    <span>500 t crude steel (BOF) · China</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#bfdbfe', marginBottom: '6px' }}>
                    <span>{mockEmissions.toFixed(0)} tCO₂ × €{etsPrice.toFixed(0)}</span>
                    <span>{fmt(mockGross)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86efac', marginBottom: '6px' }}>
                    <span>− China carbon credit (€7/tCO₂)</span>
                    <span>− {fmt(mockDeduction)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px' }}>
                    <span style={{ color: '#e2e8f0' }}>Net CBAM liability</span>
                    <span>{fmt(mockNet)}</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#93c5fd' }}>
                  Procurement tip: Sourcing from Turkey (€15/tCO₂) saves {fmt((7 - 15 < 0 ? 0 : (7 - 15)) * mockEmissions)} vs. China
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: '20px' }}>
                From import data to<br />declaration-ready report
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>
                Carbonis calculates your exact CBAM liability using live EU ETS prices,
                country-specific carbon credits, and official emission factors from
                EU Regulation 2023/956 annexes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Live EU ETS price updated hourly',
                  'Country carbon credit deductions (20+ countries)',
                  'Procurement optimisation — find lowest CBAM cost supplier',
                  'XML export for EU CBAM Registry',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>{icons.check}</span>
                    <span style={{ fontSize: '14px', color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 0', background: '#FFFBF3' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '12px' }}>
              Full-stack CBAM compliance
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Calculator, marketplace, declarations — one platform</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                icon: icons.calculator,
                title: 'CBAM Calculator',
                badge: 'Free',
                badgeColor: '#22c55e',
                desc: 'Instant liability estimates for 6 sectors, 20+ products, 20+ origin countries. Live EU ETS price. Country carbon credit deductions. Procurement comparison.',
                href: '/cbam',
              },
              {
                icon: icons.marketplace,
                title: 'Certificate Marketplace',
                badge: 'Beta Q4 2026',
                badgeColor: '#265CFF',
                desc: 'OTC bulletin board for CBAM and GO certificates. Sellers list free, buyers matched automatically. EFET contract template on every match.',
                href: '/register',
              },
              {
                icon: icons.document,
                title: 'Compliance Reports',
                badge: 'PRO',
                badgeColor: '#f59e0b',
                desc: 'CBAM XML declarations for the EU Registry. ARSO and DEHSt formats. Audit trail, submission history. Supplier data request templates.',
                href: '/register',
              },
            ].map(f => (
              <Link key={f.title} href={f.href}
                className="card-3d"
                style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#265CFF' }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, background: `${f.badgeColor}18`, color: f.badgeColor, padding: '3px 10px', borderRadius: '999px' }}>
                    {f.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: 'white', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '12px' }}>
              Up and running in minutes
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>No consultants. No spreadsheets. No guessing.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { n: '01', title: 'Register your company', desc: 'Sign up with your EU VAT number. We verify it instantly via the EU VIES registry. 30-day free trial, no credit card.' },
              { n: '02', title: 'Enter your imports', desc: 'Select CN code, country of origin, quantity. We apply official emission factors and live ETS price automatically.' },
              { n: '03', title: 'Generate your declaration', desc: 'Download CBAM XML for the EU Registry or export PDF for auditors. Submission history saved automatically.' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#0B2471', color: 'white', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '12px' }}>
              Transparent pricing
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Sellers list for free, forever. Compliance and trading plans include a 30-day trial.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
            {[
              {
                name: 'Seller',
                price: '€0',
                period: 'forever',
                features: [
                  'Post CBAM & GO certificate listings',
                  'EU VAT / VIES verified profile',
                  'View & inquiry counter',
                  'EFET contract on match',
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
                  'Supplier data request templates',
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
                  'Automated match notifications',
                  'EUA price alerts',
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
                style={{
                  borderRadius: '18px',
                  border: p.highlight ? '2px solid #265CFF' : '1px solid #e2e8f0',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: p.highlight ? '#0B2471' : 'white',
                  position: 'relative',
                }}
              >
                {p.highlight && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#265CFF', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: p.highlight ? '#93c5fd' : '#64748b', marginBottom: '4px' }}>{p.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 800, color: p.highlight ? 'white' : '#0f172a' }}>{p.price}</span>
                    <span style={{ fontSize: '14px', color: p.highlight ? '#93c5fd' : '#94a3b8' }}>{p.period}</span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: p.highlight ? '#bfdbfe' : '#475569' }}>
                      <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }}>{icons.check}</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: p.highlight ? 'white' : '#0B2471',
                    color: p.highlight ? '#0B2471' : 'white',
                  }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ borderTop: '1px solid #e2e8f0', background: 'white', padding: '40px 0' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
            {[
              { icon: icons.shield, label: 'Regulation', value: 'EU 2023/956' },
              { icon: icons.building, label: 'Data hosting', value: 'EU data centres' },
              { icon: icons.globe, label: 'CBAM sectors', value: '6 covered' },
              { icon: icons.globe, label: 'Origin countries', value: '20+ supported' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#265CFF' }}>{t.icon}</span>
                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{t.label}</p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0B2471', color: '#93c5fd', padding: '56px 0 32px' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '48px', marginBottom: '40px' }}>
            <div>
              <div style={{ marginBottom: '10px' }}>
                <CarbonisLogo size="md" variant="dark" />
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, maxWidth: '260px', margin: 0 }}>
                EU Environmental Compliance Marketplace — CBAM declarations, certificate trading, regulatory monitoring.
              </p>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Platform</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <Link href="/cbam" style={{ color: '#93c5fd', textDecoration: 'none' }}>CBAM Calculator</Link>
                <Link href="/register" style={{ color: '#93c5fd', textDecoration: 'none' }}>Register</Link>
                <Link href="/login" style={{ color: '#93c5fd', textDecoration: 'none' }}>Sign in</Link>
              </div>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Legal</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>GDPR</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', fontSize: '12px', color: '#60a5fa' }}>
            © 2026 Carbonis. Not legal or tax advice. CBAM compliance is the declarant&apos;s responsibility under EU Regulation 2023/956.
          </div>
        </div>
      </footer>
    </div>
  )
}
