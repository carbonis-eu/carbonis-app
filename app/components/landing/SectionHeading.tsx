interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}

export function SectionHeading({ eyebrow, title, description, align = 'center', tone = 'light' }: SectionHeadingProps) {
  const centered = align === 'center'
  const dark = tone === 'dark'

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`text-sm font-semibold uppercase tracking-widest ${dark ? 'text-blue-300' : 'text-cobalt'}`}>
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-navy'}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-pretty text-lg leading-relaxed ${dark ? 'text-blue-100/80' : 'text-muted-foreground'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
