// Carbonis SVG logo — 4 nodes, 270° arc, matches brand reference sheet
// API: size='sm'|'md'|'lg', variant='light'|'dark', showTagline=boolean
// Also accepts: height (number) and withTagline (boolean) for legacy inline usage

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
  showTagline?: boolean
  height?: number       // legacy: overrides size
  withTagline?: boolean // legacy alias for showTagline
}

const SIZES = {
  sm: { icon: 28, wordmark: 15, gap: 8 },
  md: { icon: 36, wordmark: 20, gap: 10 },
  lg: { icon: 52, wordmark: 28, gap: 14 },
}

export function CarbonisIcon({ size = 36, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  // Fixed viewBox 56×56, center (28,28), radius 19
  // 4 nodes at 60°, 150°, 240°, 330° — 270° clockwise arc, 90° gap on the right
  // 60°:  x=37.5 y=44.5   150°: x=11.5 y=37.5
  // 240°: x=18.5 y=11.5   330°: x=44.5 y=18.5
  const id = `cg-${size}-${variant}`
  const stopA = variant === 'dark' ? '#60A5FA' : '#4B7FFF'
  const stopB = variant === 'dark' ? '#265CFF' : '#265CFF'
  const stopC = variant === 'dark' ? '#93c5fd' : '#0B2471'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="10" y1="8" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={stopA} />
          <stop offset="50%"  stopColor={stopB} />
          <stop offset="100%" stopColor={stopC} />
        </linearGradient>
      </defs>
      {/* 270° clockwise arc from lower-right (60°) to upper-right (330°) */}
      <path
        d="M 37.5,44.5 A 19,19 0 1,1 44.5,18.5"
        stroke={`url(#${id}-g)`}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 4 nodes */}
      <circle cx="37.5" cy="44.5" r="4.2" fill={`url(#${id}-g)`} />
      <circle cx="11.5" cy="37.5" r="4.2" fill={`url(#${id}-g)`} />
      <circle cx="18.5" cy="11.5" r="4.2" fill={`url(#${id}-g)`} />
      <circle cx="44.5" cy="18.5" r="4.2" fill={`url(#${id}-g)`} />
    </svg>
  )
}

export default function CarbonisLogo({
  size = 'md',
  variant = 'light',
  showTagline = false,
  height,
  withTagline,
}: LogoProps) {
  // height prop overrides size (legacy inline usage)
  let s = SIZES[size]
  if (height) {
    s = { icon: Math.round(height * 0.78), wordmark: Math.round(height * 0.43), gap: Math.round(height * 0.22) }
  }
  const tagline = showTagline || withTagline || false
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
        {tagline && (
          <div style={{
            fontSize: Math.round(s.wordmark * 0.55),
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
