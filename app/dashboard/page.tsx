export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LockedFeatureCard from './_components/LockedFeatureCard'

function getFirstName(email: string): string {
  const local = email.split('@')[0]
  const part = local.split(/[._-]/)[0]
  return part.charAt(0).toUpperCase() + part.slice(1)
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const InfoIcon = ({ text }: { text: string }) => (
  <span title={text} style={{ display: 'inline-flex', cursor: 'help', marginLeft: '4px', verticalAlign: 'middle' }}>
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="#cbd5e1" strokeWidth="1.2"/>
      <path d="M6.5 5.5v3M6.5 4.5v-.3" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  </span>
)

function EmptyBlock({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', textAlign: 'center' }}>
      <div style={{ color: '#e2e8f0', marginBottom: '10px' }}>{icon}</div>
      <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{title}</p>
      <p style={{ color: '#cbd5e1', fontSize: '11px', maxWidth: '240px' }}>{desc}</p>
    </div>
  )
}

// ─── BUYER ───────────────────────────────────────────────────────────────────

function BuyerDashboard({ firstName }: { firstName: string }) {
  return (
    <>
      <div style={{ background: '#EEF2FF', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="9" cy="9" r="7" stroke="#265CFF" strokeWidth="1.4"/><path d="M9 5.5v5M9 12v.5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a8a', marginBottom: '2px' }}>OTC Certificate Marketplace</p>
          <p style={{ fontSize: '12px', color: '#3730a3' }}>Purchase CBAM, GO and EUA certificates directly from verified sellers. No intermediary, no broker fees. Direct buyer-seller transactions with EFET documentation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Available certificates</h3>
              <InfoIcon text="Browse CBAM, GO and EUA certificates listed by verified sellers. Coming in next release." />
            </div>
            <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>Coming soon</span>
          </div>
          <EmptyBlock
            icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 28L12 16l7 7 6-10 7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            title="No listings yet"
            desc="Certificate listings will appear here. You'll be notified when matching offers are available."
          />
        </div>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>My purchases</h3>
              <InfoIcon text="History of certificates you have purchased through Carbonis." />
            </div>
          </div>
          <EmptyBlock
            icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M8 3L4 9v20a3 3 0 003 3h22a3 3 0 003-3V9l-4-6z" stroke="currentColor" strokeWidth="1.8"/><line x1="4" y1="9" x2="32" y2="9" stroke="currentColor" strokeWidth="1.8"/></svg>}
            title="No purchases yet"
            desc="Your completed transactions will appear here after your first purchase."
          />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Estimate your CBAM obligation</h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Before purchasing, calculate how many CBAM certificates you need based on your imports.</p>
        <Link href="/dashboard/emissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#265CFF', color: 'white', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 10L5 5l3 3 2.5-4 2.5 4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Open CBAM Calculator
        </Link>
      </div>

      {/* PRO tools locked — upgrade prompt */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>PRO Compliance tools</h3>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="5.5" width="9" height="6.5" rx="1.5" stroke="#cbd5e1" strokeWidth="1.2"/><path d="M4 5.5V4a2.5 2.5 0 015 0v1.5" stroke="#cbd5e1" strokeWidth="1.2"/></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <LockedFeatureCard title="Multi-shipment CBAM Planner" description="Plan annual CBAM liability across multiple shipments and CN codes." requiredPlan="PRO Compliance" />
          <LockedFeatureCard title="Supplier Emissions Tool" description="Send standardised questionnaires to suppliers and collect embedded CO₂ data." requiredPlan="PRO Compliance" />
          <LockedFeatureCard title="CBAM Declaration Builder" description="Build and export XML-ready CBAM declarations for the EU CBAM Register." requiredPlan="PRO Compliance" />
        </div>
      </div>
    </>
  )
}

// ─── SELLER ──────────────────────────────────────────────────────────────────

function SellerDashboard({ firstName }: { firstName: string }) {
  return (
    <>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="9" cy="9" r="7" stroke="#16a34a" strokeWidth="1.4"/><path d="M6 9l2 2 4-4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#14532d', marginBottom: '2px' }}>Seller account — Free forever</p>
          <p style={{ fontSize: '12px', color: '#166534' }}>List your surplus CBAM, GO or EUA certificates. Qualified buyers are notified automatically. You close the deal directly — Carbonis provides EFET contract documentation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>My listings</h3>
              <InfoIcon text="Certificates you have listed for sale. Buyers matching your type and quantity will be notified." />
            </div>
            <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>Marketplace opening soon</span>
          </div>
          <EmptyBlock
            icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 8v20M8 18h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            title="No active listings"
            desc="Once the marketplace opens, you can list your surplus certificates here. We'll notify you when it's ready."
          />
        </div>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Listing performance</h3>
              <InfoIcon text="Views and inquiries on your listings. Available once you create your first listing." />
            </div>
          </div>
          <EmptyBlock
            icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 18s6-12 14-12 14 12 14 12-6 12-14 12S4 18 4 18z" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="18" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>}
            title="No views yet"
            desc="View counts and buyer inquiries will appear here once your listing is live."
          />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>How selling works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { step: '1', label: 'List certificates', desc: 'Specify type, quantity and minimum order' },
            { step: '2', label: 'Buyer matches', desc: 'System alerts matching buyers automatically' },
            { step: '3', label: 'EFET contract', desc: 'Carbonis generates standardised documentation' },
            { step: '4', label: 'Direct settlement', desc: 'Buyer pays you directly — no intermediary' },
          ].map(s => (
            <div key={s.step} style={{ padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px', background: '#fafafa' }}>
              <div style={{ width: '22px', height: '22px', background: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#265CFF', marginBottom: '8px' }}>{s.step}</div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{s.label}</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── COMPLIANCE ───────────────────────────────────────────────────────────────

function ComplianceDashboard({ firstName }: { firstName: string }) {
  return (
    <>
      <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 18px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><circle cx="9" cy="9" r="7" stroke="#d97706" strokeWidth="1.4"/><path d="M9 5.5v4.5l2.5 1.5" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#78350f' }}>Next deadline: 31 May 2027</span>
          <span style={{ fontSize: '12px', color: '#92400e', marginLeft: '8px' }}>First annual CBAM declaration (covers 2026 imports)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '18px' }}>
        {[
          { label: 'Total emissions', info: 'Your calculated CBAM certificate requirements based on imported goods and their embedded emissions.', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 8l3.5 3.5 3-5 3.5 5.5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>, empty: 'Add import data to calculate' },
          { label: 'Declarations filed', info: 'CBAM declarations submitted. First declaration due 31 May 2027 (for 2026 imports).', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="#265CFF" strokeWidth="1.4"/><path d="M5 7h8M5 10h5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>, empty: 'No declarations yet' },
          { label: 'Compliance status', info: 'Overall CBAM compliance status based on your import data and certificate holdings.', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#265CFF" strokeWidth="1.4"/><path d="M6 9l2 2 4-4" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>, empty: 'Add data to assess status' },
        ].map(k => (
          <div key={k.label} style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '12px' }}>{k.label}</p>
                <InfoIcon text={k.info} />
              </div>
              <div style={{ width: '34px', height: '34px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{k.icon}</div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>{k.empty}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Get started</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'CBAM Calculator', sub: 'Calculate your obligations', href: '/dashboard/emissions', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 8l3.5 3.5 3-5 3.5 5.5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg> },
              { label: 'Supply chain', sub: 'Add supplier emissions', href: '/dashboard/supply-chain', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="3.5" cy="9" r="2" stroke="#265CFF" strokeWidth="1.4"/><circle cx="14.5" cy="4.5" r="2" stroke="#265CFF" strokeWidth="1.4"/><circle cx="14.5" cy="13.5" r="2" stroke="#265CFF" strokeWidth="1.4"/><path d="M5.5 8.5L12.5 5M5.5 9.5L12.5 13" stroke="#265CFF" strokeWidth="1.2"/></svg> },
              { label: 'Regulations', sub: 'CBAM regulatory updates', href: '/dashboard/regulations', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="1.5" width="13" height="15" rx="1.5" stroke="#265CFF" strokeWidth="1.4"/><path d="M5.5 6.5h7M5.5 9.5h7M5.5 12.5h4" stroke="#265CFF" strokeWidth="1.3" strokeLinecap="round"/></svg> },
              { label: 'Reports', sub: 'Generate CBAM reports', href: '/dashboard/reports', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="3.5" width="15" height="11" rx="1.5" stroke="#265CFF" strokeWidth="1.4"/><path d="M4.5 9l2 2 5-4" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg> },
            ].map(a => (
              <Link key={a.label} href={a.href} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px', background: '#fafafa', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{a.label}</p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{a.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Key CBAM dates</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { date: 'Oct 2023 – Dec 2025', label: 'Transitional period', status: 'past', desc: 'Reporting only, no certificates' },
              { date: '1 Jan 2026', label: 'Definitive period begins', status: 'current', desc: 'Certificate purchases required' },
              { date: '31 May 2027', label: 'First declaration due', status: 'upcoming', desc: 'Covers all 2026 imports' },
              { date: '30 Sep 2027', label: 'First surrender deadline', status: 'upcoming', desc: 'Certificates surrendered to EU' },
            ].map(t => (
              <div key={t.date} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.status === 'past' ? '#cbd5e1' : t.status === 'current' ? '#22c55e' : '#265CFF', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{t.date}</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: t.status === 'past' ? '#94a3b8' : '#0f172a' }}>{t.label}</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRO tools locked — upgrade prompt */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>PRO Compliance tools</h3>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="5.5" width="9" height="6.5" rx="1.5" stroke="#cbd5e1" strokeWidth="1.2"/><path d="M4 5.5V4a2.5 2.5 0 015 0v1.5" stroke="#cbd5e1" strokeWidth="1.2"/></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <LockedFeatureCard title="Multi-shipment CBAM Planner" description="Plan annual CBAM liability across multiple shipments and CN codes." requiredPlan="PRO Compliance" />
          <LockedFeatureCard title="Supplier Emissions Tool" description="Send standardised questionnaires to suppliers and collect embedded CO₂ data." requiredPlan="PRO Compliance" />
          <LockedFeatureCard title="CBAM Declaration Builder" description="Build and export XML-ready CBAM declarations for the EU CBAM Register." requiredPlan="PRO Compliance" />
        </div>
      </div>
    </>
  )
}

// ─── ROLE SELECTOR ────────────────────────────────────────────────────────────

function RoleSelector({ firstName }: { firstName: string }) {
  return (
    <div style={{ maxWidth: '520px', margin: '48px auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Welcome, {firstName}. What brings you here?
      </h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>
        Select your primary use case to personalise your dashboard.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { role: 'buyer', label: 'Certificate Buyer', desc: 'I need to purchase CBAM, GO or EUA certificates', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 2L2 6v13a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6h18" stroke="currentColor" strokeWidth="1.5"/><path d="M15 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5"/></svg> },
          { role: 'seller', label: 'Certificate Seller', desc: 'I have surplus certificates to sell — free account', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L2 7l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17l9 5 9-5M2 12l9 5 9-5" stroke="currentColor" strokeWidth="1.5"/></svg> },
          { role: 'compliance', label: 'Compliance Only', desc: 'I need CBAM/ETS compliance tools and reports', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 11l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
        ].map(r => (
          <form key={r.role} action="/api/set-role" method="POST">
            <input type="hidden" name="role" value={r.role} />
            <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: '44px', height: '44px', background: '#EEF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#265CFF', flexShrink: 0 }}>{r.icon}</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{r.label}</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>{r.desc}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}><path d="M5 3l4 4-4 4" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const { welcome } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, vat_number, role, tier, trial_ends_at')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') redirect('/admin')

  const firstName = getFirstName(user.email ?? 'there')
  const greeting = getGreeting()
  const companyName = profile?.company_name ?? 'Your Company'
  const tier = profile?.tier ?? 'free'
  const initials = firstName.slice(0, 2).toUpperCase()
  const isTrial = tier === 'free'
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 30

  const userRole = profile?.role as string | null | undefined
  const knownRoles = ['buyer', 'seller', 'compliance']
  const hasRole = userRole && knownRoles.includes(userRole)

  const roleLabel: Record<string, string> = {
    buyer: 'Buyer',
    seller: 'Seller',
    compliance: 'Compliance',
  }

  const roleSubtitle: Record<string, string> = {
    buyer: 'Browse available certificates and manage your purchases.',
    seller: 'Manage your certificate listings and track buyer interest.',
    compliance: 'Track your CBAM obligations and prepare declarations.',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '5px 10px' }}>{companyName}</span>
          {hasRole && (
            <span style={{ fontSize: '11px', background: '#EEF2FF', color: '#265CFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
              {roleLabel[userRole!]}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTrial && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#92400e', fontWeight: 500 }}>
              Trial: {trialDaysLeft}d left
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #0B2471, #265CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>{initials}</div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{firstName}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

        {/* One-time welcome banner after registration */}
        {welcome === '1' && (
          <div style={{ background: '#EEF2FF', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '12px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#265CFF" strokeWidth="1.4"/><path d="M6 9l2 2 4-4" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <p style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 500 }}>
              Welcome to Carbonis! Start by selecting your role below.
            </p>
          </div>
        )}

        {!hasRole ? (
          <RoleSelector firstName={firstName} />
        ) : (
          <>
            {/* Welcome strip */}
            <div style={{ background: 'linear-gradient(135deg, #0B2471 0%, #265CFF 100%)', borderRadius: '14px', padding: '22px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '200px', opacity: 0.08 }}>
                <svg viewBox="0 0 200 100" width="200" height="100" style={{ position: 'absolute', right: 0 }}><circle cx="150" cy="50" r="90" fill="none" stroke="white" strokeWidth="1"/><circle cx="150" cy="50" r="55" fill="none" stroke="white" strokeWidth="1"/></svg>
              </div>
              <div style={{ position: 'relative' }}>
                <h1 style={{ fontSize: '21px', fontWeight: 800, color: 'white', marginBottom: '4px', letterSpacing: '-0.02em' }}>{greeting}, {firstName}.</h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>{roleSubtitle[userRole!]}</p>
              </div>
            </div>

            {userRole === 'buyer'      && <BuyerDashboard firstName={firstName} />}
            {userRole === 'seller'     && <SellerDashboard firstName={firstName} />}
            {userRole === 'compliance' && <ComplianceDashboard firstName={firstName} />}
          </>
        )}

      </main>
    </div>
  )
}
