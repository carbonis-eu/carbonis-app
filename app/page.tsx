export const instant = false

import Link from 'next/link'
import InlineCbamCalc from './components/InlineCbamCalc'

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

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#265CFF" fillOpacity="0.12"/>
    <path d="M5 8l2 2 4-4" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// CSS globe — radial gradient sphere with Europe/Africa outline
function GlobeVisual() {
  return (
    <div style={{ position: 'relative', width: '520px', height: '520px', flexShrink: 0 }}>
      {/* Globe glow */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 38%, #1e40af 0%, #1d4ed8 20%, #1e3a8a 40%, #0f172a 70%, transparent 100%)',
        boxShadow: '0 0 120px 40px rgba(37,92,255,0.18)',
      }}/>
      {/* Atmosphere ring */}
      <div style={{
        position: 'absolute', inset: '-8px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 38%, transparent 46%, rgba(37,92,255,0.08) 50%, rgba(37,92,255,0.04) 56%, transparent 60%)',
      }}/>
      {/* SVG continent outlines */}
      <svg viewBox="0 0 520 520" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Europe */}
        <path d="M235 145 L248 138 L265 142 L278 148 L285 158 L280 168 L270 172 L258 170 L245 175 L238 165 L232 155Z"
          fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
        {/* Scandinavia */}
        <path d="M242 118 L250 108 L260 112 L268 120 L263 130 L255 132 L246 128Z"
          fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        {/* Africa */}
        <path d="M238 195 L252 188 L270 192 L282 210 L285 238 L278 262 L265 272 L250 265 L238 248 L232 225 L234 208Z"
          fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        {/* Connection dots — EU cities */}
        {[
          [252, 155], [260, 148], [245, 162], [270, 160], [258, 140],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#60a5fa" opacity="0.7"/>
        ))}
        {/* Connection lines */}
        <line x1="252" y1="155" x2="260" y2="148" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4"/>
        <line x1="260" y1="148" x2="270" y2="160" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4"/>
        <line x1="252" y1="155" x2="245" y2="162" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4"/>
        {/* Latitude lines */}
        <ellipse cx="260" cy="260" rx="200" ry="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
        <ellipse cx="260" cy="210" rx="160" ry="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
        <ellipse cx="260" cy="310" rx="185" ry="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
      </svg>

      {/* Floating stat cards */}
      <div style={{
        position: 'absolute', right: '-40px', top: '140px',
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
        padding: '14px 18px', width: '200px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}/>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>Carbon emissions</span>
        </div>
        <div style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Under control</div>
        <svg viewBox="0 0 120 30" style={{ width: '100%', marginTop: '8px' }}>
          <path d="M0 22 Q20 20 40 18 Q60 16 80 10 Q100 6 120 4" fill="none" stroke="#265CFF" strokeWidth="1.5"/>
          <path d="M0 22 Q20 20 40 18 Q60 16 80 10 Q100 6 120 4 L120 30 L0 30Z" fill="url(#g1)"/>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#265CFF" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#265CFF" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div style={{
        position: 'absolute', right: '-40px', top: '300px',
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
        padding: '14px 18px', width: '200px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L12.2 4V10L7 13L1.8 10V4L7 1Z" stroke="#265CFF" strokeWidth="1.2"/>
            <path d="M5 7l1.5 1.5L9.5 5" stroke="#265CFF" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>Compliance status</span>
        </div>
        <div style={{ color: '#4ade80', fontSize: '14px', fontWeight: 700 }}>Full compliance</div>
        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>EU Regulation 2023/956</div>
      </div>
    </div>
  )
}

// Dashboard mockup
function DashboardMockup() {
  return (
    <div style={{
      background: '#0f172a',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
      display: 'flex',
      height: '420px',
    }}>
      {/* Sidebar */}
      <div style={{ width: '160px', background: '#0a1220', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <img src="/carbonis-icon.png" alt="Carbonis" style={{ height: '24px', width: 'auto' }}/>
        </div>
        {[
          { icon: '▦', label: 'Dashboard', active: true },
          { icon: '◎', label: 'Emissions', active: false },
          { icon: '⊞', label: 'CBAM', active: false },
          { icon: '⤴', label: 'EU ETS', active: false },
          { icon: '▤', label: 'Reports', active: false },
          { icon: '⊟', label: 'Suppliers', active: false },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', cursor: 'default',
            background: item.active ? 'rgba(37,92,255,0.12)' : 'transparent',
            borderLeft: item.active ? '2px solid #265CFF' : '2px solid transparent',
          }}>
            <span style={{ fontSize: '12px', color: item.active ? '#60a5fa' : '#475569' }}>{item.icon}</span>
            <span style={{ fontSize: '12px', color: item.active ? '#e2e8f0' : '#475569', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>Dashboard</span>
          <span style={{ color: '#475569', fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>Acme Europe Ltd. ▾</span>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Total emissions', value: '12,480 t', unit: 'CO₂e', delta: '↑ 12% vs. last quarter', deltaColor: '#f87171' },
            { label: 'CBAM declarations', value: '8', unit: '', delta: '↑ 2 pending', deltaColor: '#fbbf24' },
            { label: 'Compliance status', value: 'On track', unit: '', delta: 'All requirements met', deltaColor: '#4ade80' },
          ].map(k => (
            <div key={k.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '6px' }}>{k.label}</div>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 800 }}>{k.value} <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b' }}>{k.unit}</span></div>
              <div style={{ color: k.deltaColor, fontSize: '10px', marginTop: '4px' }}>{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600 }}>Emissions trend</span>
            <span style={{ color: '#475569', fontSize: '10px' }}>2025 ▾</span>
          </div>
          <svg viewBox="0 0 360 70" style={{ width: '100%' }}>
            {[0, 20, 40, 60].map(y => (
              <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            ))}
            <path d="M0 55 Q30 52 60 48 Q90 44 120 40 Q150 36 180 30 Q210 26 240 20 Q270 15 300 12 Q330 10 360 8"
              fill="none" stroke="#265CFF" strokeWidth="2"/>
            <path d="M0 55 Q30 52 60 48 Q90 44 120 40 Q150 36 180 30 Q210 26 240 20 Q270 15 300 12 Q330 10 360 8 L360 70 L0 70Z"
              fill="url(#chartGrad)"/>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#265CFF" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#265CFF" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {['Jan','Mar','May','Jul','Sep','Nov'].map((m, i) => (
              <text key={m} x={i * 72} y="68" fill="#475569" fontSize="9" textAnchor="middle">{m}</text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const etsPrice = await getEtsPrice()

  const mockEmissions = 500 * 1.89
  const mockNet = Math.round(mockEmissions * etsPrice - mockEmissions * 7)

  function fmt(n: number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
  }

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .float { animation: float 6s ease-in-out infinite; }
        @keyframes in { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .in1{animation:in .6s ease-out both} .in2{animation:in .6s .13s ease-out both} .in3{animation:in .6s .25s ease-out both}
        a{text-decoration:none}
        .nav-link{color:#94a3b8;font-size:14px;transition:color .15s} .nav-link:hover{color:#fff}
        .industry-card:hover{background:rgba(37,92,255,0.07)!important;border-color:rgba(37,92,255,0.3)!important}
        .feature-card:hover{box-shadow:0 8px 32px rgba(11,36,113,0.1)!important;transform:translateY(-2px)}
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/carbonis-logo-light.png" alt="Carbonis" style={{ height: '36px', width: 'auto' }}/>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#why" className="nav-link" style={{ color: '#0f172a', borderBottom: '2px solid #265CFF', paddingBottom: '2px', fontSize: '14px' }}>Home</a>
            <a href="#platform" className="nav-link">Platform</a>
            <a href="#industries" className="nav-link">Solutions</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#calculator" className="nav-link">Calculator</a>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/login" style={{ color: '#475569', fontSize: '14px', fontWeight: 500 }}>Login</Link>
            <Link href="/register" style={{
              background: '#265CFF', color: 'white', fontSize: '14px', fontWeight: 600,
              padding: '8px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO — dark ─── */}
      <section style={{
        background: 'linear-gradient(145deg, #0a1628 0%, #0d1f3c 50%, #091325 100%)',
        minHeight: '620px', overflow: 'hidden', position: 'relative',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}/>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px', display: 'flex', alignItems: 'center', gap: '48px', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div style={{ flex: 1, maxWidth: '580px' }}>
            <div className="in1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(37,92,255,0.12)', border: '1px solid rgba(37,92,255,0.25)',
              color: '#93c5fd', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '6px 14px', borderRadius: '999px', marginBottom: '28px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }}/>
              EU Carbon Compliance Platform
            </div>

            <h1 className="in2" style={{
              fontSize: '58px', fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.035em', marginBottom: '20px',
            }}>
              <span style={{ color: 'white' }}>Stay compliant.<br/></span>
              <span style={{ color: '#60a5fa' }}>Reduce your footprint.</span>
            </h1>

            <p className="in3" style={{ color: '#94a3b8', fontSize: '17px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '480px' }}>
              Carbonis helps EU importers and businesses navigate{' '}
              <strong style={{ color: '#cbd5e1', fontWeight: 600 }}>carbon regulations</strong> with confidence.
              Track, calculate, report — all in one platform.
            </p>

            <div className="in3" style={{ display: 'flex', gap: '14px', marginBottom: '36px', flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                background: '#265CFF', color: 'white', fontWeight: 700, fontSize: '15px',
                padding: '13px 28px', borderRadius: '10px',
                boxShadow: '0 0 40px rgba(37,92,255,0.4)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                Get started →
              </Link>
              <a href="#calculator" style={{
                color: 'white', fontWeight: 600, fontSize: '15px',
                padding: '13px 28px', borderRadius: '10px',
                border: '1.5px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)',
              }}>
                Try free calculator
              </a>
            </div>

            {/* Compliance badges */}
            <div className="in3" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['EU ETS', 'CBAM', 'ESRS', 'CSRD'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3 3 6-6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — globe */}
          <div className="float in3" style={{ flexShrink: 0 }}>
            <GlobeVisual/>
          </div>
        </div>
      </section>

      {/* ─── WHY CARBONIS ─── */}
      <section id="why" style={{ background: 'white', padding: '88px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start', marginBottom: '64px' }}>
            <div>
              <p style={{ color: '#265CFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>WHY CARBONIS</p>
              <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
                Complex regulations.<br/>
                <span style={{ color: '#265CFF' }}>Made simple.</span>
              </h2>
            </div>
            <div style={{ paddingTop: '8px' }}>
              <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.75, margin: 0 }}>
                We turn complex EU carbon regulations into a simple, clear and automated process — so you can focus on your business, not paperwork. Live EU ETS prices, official emission factors, audit-ready exports.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M11 2L19.5 7V15L11 20L2.5 15V7L11 2Z"/>
                    <path d="M8 11l2 2 4-4"/>
                  </svg>
                ),
                title: 'Regulatory expertise',
                desc: 'Always up to date with the latest EU regulations and CBAM reporting requirements.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="9"/>
                    <path d="M11 6v5l3 3"/>
                  </svg>
                ),
                title: 'Automated processes',
                desc: 'Save time with smart workflows, calculations and ready-to-use reports in minutes.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="2" y="12" width="4" height="8" rx="1"/>
                    <rect x="9" y="7" width="4" height="13" rx="1"/>
                    <rect x="16" y="2" width="4" height="18" rx="1"/>
                  </svg>
                ),
                title: 'Full transparency',
                desc: 'Track emissions, data and compliance status in real time with live EU ETS pricing.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M11 2C6 2 2 6 2 11s4 9 9 9 9-4 9-9"/>
                    <path d="M15 2c1.5 2 2.5 4 2.5 7"/>
                    <path d="M11 7c0 3-2 5-4 6"/>
                  </svg>
                ),
                title: 'Real impact',
                desc: 'Lower your carbon footprint and build a more sustainable supply chain across borders.',
              },
            ].map(f => (
              <div key={f.title}
                className="feature-card"
                style={{ transition: 'all .2s', borderRadius: '14px', padding: '24px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px', background: '#f8fafc',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM ─── */}
      <section id="platform" style={{ background: '#f1f5f9', padding: '88px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#265CFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>THE PLATFORM</p>
              <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                Everything you need<br/>
                for <span style={{ color: '#265CFF' }}>carbon compliance.</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                From CBAM liability calculations to EU ETS monitoring — Carbonis brings all your compliance needs into one intuitive platform.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {[
                  'CBAM reporting & data management',
                  'EU ETS emissions tracking',
                  'Live EUA price alerts',
                  'ESRS & CSRD reporting',
                  'Certificate marketplace (CBAM + GO)',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckIcon/>
                    <span style={{ fontSize: '14px', color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#265CFF', color: 'white', fontWeight: 700, fontSize: '14px',
                padding: '11px 24px', borderRadius: '9px',
              }}>
                Explore all features →
              </Link>
            </div>
            <DashboardMockup/>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section id="industries" style={{ background: 'white', padding: '88px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '10px' }}>Built for your industry</h2>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Whether you&apos;re an importer, manufacturer or distributor, Carbonis adapts to your business.</p>
            </div>
            <Link href="/register" style={{ color: '#265CFF', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
              See all solutions →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 20L4 8L14 2L24 8V20L14 26L4 20Z"/>
                    <path d="M14 12v6M11 15h6"/>
                  </svg>
                ),
                label: 'Importers\n& Distributors',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="10" width="22" height="15" rx="2"/>
                    <path d="M9 10V7a5 5 0 0110 0v3"/>
                    <circle cx="14" cy="17" r="2"/>
                  </svg>
                ),
                label: 'Manufacturers',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="10" cy="22" r="2"/><circle cx="20" cy="22" r="2"/>
                    <path d="M3 4h3l3 10h11l3-7H8"/>
                  </svg>
                ),
                label: 'Retail &\nE-commerce',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="22" height="22" rx="2"/>
                    <path d="M3 10h22M10 3v22"/>
                  </svg>
                ),
                label: 'Large\nEnterprises',
              },
            ].map(ind => (
              <div key={ind.label}
                className="industry-card"
                style={{
                  border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px 20px',
                  textAlign: 'center', cursor: 'default', transition: 'all .2s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>{ind.icon}</div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.4, margin: 0, whiteSpace: 'pre-line' }}>{ind.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CBAM CALCULATOR ─── */}
      <section id="calculator" style={{ background: '#f1f5f9', padding: '88px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '64px', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#265CFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>FREE CBAM CALCULATOR</p>
              <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                Know your liability<br/>
                <span style={{ color: '#265CFF' }}>before the deadline.</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                Calculate your exact CBAM carbon border adjustment costs using live EU ETS prices, country-specific carbon credits, and official emission factors from EU Regulation 2023/956.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', display: 'inline-flex' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease-in-out infinite' }}/>
                <span style={{ color: '#64748b', fontSize: '13px' }}>EU ETS live</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0B2471' }}>€{etsPrice.toFixed(2)}</span>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>/ tCO₂</span>
              </div>
            </div>
            <InlineCbamCalc etsPrice={etsPrice}/>
          </div>
        </div>
      </section>

      {/* ─── TRUST + TESTIMONIAL ─── */}
      <section style={{ background: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '12px' }}>
                Trusted by forward-thinking businesses across Europe
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px' }}>
                Join companies that are already turning compliance into a competitive advantage.
              </p>
              {/* Company name logos (text-based, not actual brand marks) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {['SIJ Group', 'Salonit Anhovo', 'Energie AG', 'Talum d.d.'].map(name => (
                  <div key={name} style={{
                    border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em' }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '36px', border: '1px solid #e2e8f0' }}>
              <svg width="28" height="20" viewBox="0 0 28 20" fill="#265CFF" opacity="0.4" style={{ marginBottom: '20px' }}>
                <path d="M0 20V12C0 5.4 4 1.6 12 0v4C8.4 5.2 6.4 7.6 6 11h6v9H0zm16 0V12C16 5.4 20 1.6 28 0v4c-3.6 1.2-5.6 3.6-6 7h6v9H16z"/>
              </svg>
              <p style={{ color: '#1e293b', fontSize: '16px', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic' }}>
                &ldquo;Carbonis has completely simplified our CBAM reporting process. What used to take weeks now takes hours. The platform is intuitive, reliable and the support team is outstanding.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #265CFF, #0B2471)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '16px',
                }}>
                  JW
                </div>
                <div>
                  <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, margin: 0 }}>Julia Weber</p>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>Head of Sustainability, European Imports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ background: '#f8fafc', padding: '88px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#265CFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>PRICING</p>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Transparent pricing
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Sellers list for free, forever. Compliance and trading plans include a 30-day trial.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                name: 'Seller', price: '€0', period: 'forever',
                features: ['Post CBAM & GO listings', 'EU VAT / VIES verified profile', 'View & inquiry counter', 'EFET contract on match', 'No commission — ever'],
                cta: 'Register as seller', highlight: false,
              },
              {
                name: 'PRO Compliance', price: '€79', period: '/month',
                features: ['Unlimited CBAM calculations', 'Compliance dashboard', 'XML/PDF export (ARSO, DEHSt)', 'AI cost forecast', 'Supplier data request', '30-day free trial'],
                cta: 'Start free trial', highlight: true,
              },
              {
                name: 'PRO Trading', price: '€249', period: '/month',
                features: ['All PRO Compliance features', 'OTC certificate marketplace', 'Automated match alerts', 'EUA price alerts', 'EU Sanctions screening', '30-day free trial'],
                cta: 'Start free trial', highlight: false,
              },
            ].map(p => (
              <div key={p.name} style={{
                borderRadius: '18px', padding: '32px',
                border: p.highlight ? '2px solid #265CFF' : '1px solid #e2e8f0',
                background: p.highlight ? '#0B2471' : 'white',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}>
                {p.highlight && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: '#265CFF', color: 'white', fontSize: '11px', fontWeight: 700,
                    padding: '4px 16px', borderRadius: '999px',
                  }}>MOST POPULAR</div>
                )}
                <p style={{ fontSize: '13px', color: p.highlight ? '#93c5fd' : '#64748b', fontWeight: 600, marginBottom: '6px' }}>{p.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '40px', fontWeight: 900, color: p.highlight ? 'white' : '#0f172a' }}>{p.price}</span>
                  <span style={{ fontSize: '14px', color: p.highlight ? '#93c5fd' : '#94a3b8' }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '11px', flex: 1 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: p.highlight ? '#bfdbfe' : '#475569' }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
                        <path d="M3 7.5l3 3 6-6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{
                  display: 'block', textAlign: 'center', padding: '13px',
                  borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                  background: p.highlight ? 'white' : '#0B2471',
                  color: p.highlight ? '#0B2471' : 'white',
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA — dark ─── */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%)', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '40px' }}>
          <div>
            <p style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>READY TO GET STARTED?</p>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0 }}>
              Your carbon compliance<br/>journey starts here.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'right', margin: 0 }}>Start free trial and see how Carbonis simplifies your compliance.</p>
            <Link href="/register" style={{
              background: '#265CFF', color: 'white', fontWeight: 700, fontSize: '15px',
              padding: '14px 30px', borderRadius: '10px',
              boxShadow: '0 0 40px rgba(37,92,255,0.35)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              Get started →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER — dark ─── */}
      <footer style={{ background: '#0a1220', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
            <div>
              <div style={{ marginBottom: '16px' }}><img src="/carbonis-logo-dark.png" alt="Carbonis" style={{ height: '44px', width: 'auto' }}/></div>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px', margin: 0 }}>
                EU Environmental Compliance Marketplace — CBAM declarations, certificate trading, regulatory monitoring.
              </p>
            </div>
            {[
              { title: 'Product', links: [['Platform', '#platform'], ['Calculator', '#calculator'], ['Pricing', '#pricing']] },
              { title: 'Solutions', links: [['Importers', '/register'], ['Manufacturers', '/register'], ['Enterprises', '/register']] },
              { title: 'Company', links: [['Privacy Policy', '#'], ['Terms of Service', '#'], ['GDPR', '#']] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.04em' }}>{col.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map(([label, href]) => (
                    <a key={label} href={href} style={{ color: '#475569', fontSize: '14px', transition: 'color .15s' }} className="nav-link">{label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#334155', fontSize: '12px', margin: 0 }}>© 2026 Carbonis. Not legal or tax advice. Compliance is the declarant&apos;s responsibility under EU Regulation 2023/956.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* LinkedIn, X, YouTube placeholder icons */}
              {[
                <svg key="li" width="18" height="18" viewBox="0 0 24 24" fill="#475569"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="#475569"/></svg>,
                <svg key="x" width="18" height="18" viewBox="0 0 24 24" fill="#475569"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                <svg key="yt" width="18" height="18" viewBox="0 0 24 24" fill="#475569"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>,
              ]}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
