// Carbonis logo — circular arc symbol with 3 nodes, blue gradient
// Matches the professional logo design (C-arc / carbon molecule motif)

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'  // light = for light backgrounds, dark = for dark backgrounds
  showTagline?: boolean
}

const SIZES = {
  sm: { icon: 28, wordmark: 16, gap: 8 },
  md: { icon: 36, wordmark: 20, gap: 10 },
  lg: { icon: 52, wordmark: 28, gap: 14 },
}

export function CarbonisIcon({ size = 36, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  const id = `cg-${size}-${variant}`
  const c = size / 2
  const r = size * 0.38
  // Arc: C-shape opening to the right
  // Start at upper-right (~330°), go counterclockwise 300° to lower-right (~60°)
  const startX = c + r * Math.cos(-Math.PI / 3)  // 60° above horizontal right
  const startY = c + r * Math.sin(-Math.PI / 3)
  const endX   = c + r * Math.cos(Math.PI / 3)   // 60° below horizontal right
  const endY   = c + r * Math.sin(Math.PI / 3)
  const midX   = c - r                             // 180° = left node

  const dotR   = size * 0.075
  const stroke = size * 0.075

  const color1 = variant === 'dark' ? '#60A5FA' : '#4A90E2'
  const color2 = variant === 'dark' ? '#265CFF' : '#0B2471'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1={startX} y1={startY} x2={endX} y2={endY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color1} />
          <stop offset="50%" stopColor="#265CFF" />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      {/* Main arc — large 300° C-shape */}
      <path
        d={`M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${r} ${r} 0 1 0 ${endX.toFixed(2)} ${endY.toFixed(2)}`}
        stroke={`url(#${id}-grad)`}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {/* 3 nodes */}
      <circle cx={startX} cy={startY} r={dotR} fill={color1} />
      <circle cx={midX}   cy={c}      r={dotR * 1.2} fill="#265CFF" />
      <circle cx={endX}   cy={endY}   r={dotR} fill={color2} />
    </svg>
  )
}

export default function CarbonisLogo({
  size = 'md',
  variant = 'light',
  showTagline = false,
}: LogoProps) {
  const s = SIZES[size]
  const textColor = variant === 'dark' ? '#ffffff' : '#0B2471'
  const taglineColor = variant === 'dark' ? '#93c5fd' : '#64748b'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <CarbonisIcon size={s.icon} variant={variant} />
      <div>
        <div style={{
          fontSize: s.wordmark,
          fontWeight: 800,
          color: textColor,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        }}>
          Carbonis
        </div>
        {showTagline && (
          <div style={{
            fontSize: s.wordmark * 0.55,
            color: taglineColor,
            letterSpacing: '0.01em',
            marginTop: 2,
            fontWeight: 400,
          }}>
            Carbon compliance. Made simple.
          </div>
        )}
      </div>
    </div>
  )
}
