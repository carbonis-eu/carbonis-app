'use client'

import Link from 'next/link'

interface LockedFeatureCardProps {
  title: string
  description: string
  requiredPlan: 'PRO Compliance' | 'PRO Trading'
}

const planColors: Record<LockedFeatureCardProps['requiredPlan'], { bg: string; color: string }> = {
  'PRO Compliance': { bg: '#dcfce7', color: '#15803d' },
  'PRO Trading':    { bg: '#fef9c3', color: '#b45309' },
}

export default function LockedFeatureCard({ title, description, requiredPlan }: LockedFeatureCardProps) {
  const { bg, color } = planColors[requiredPlan]

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px dashed #cbd5e1',
      borderRadius: '12px',
      padding: '18px 20px',
      opacity: 0.85,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          {/* Lock icon */}
          <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="#94a3b8" strokeWidth="1.3"/>
              <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="#94a3b8" strokeWidth="1.3"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '2px' }}>{title}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>{description}</p>
          </div>
        </div>
        <span style={{ background: bg, color, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {requiredPlan}
        </span>
      </div>
      <Link
        href="/pricing"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#265CFF', textDecoration: 'none' }}
      >
        Upgrade to unlock →
      </Link>
    </div>
  )
}
