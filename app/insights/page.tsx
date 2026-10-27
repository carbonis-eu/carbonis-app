export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Article, ArticleCategory } from '@/lib/types/article'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types/article'
import { SiteHeader } from '@/app/components/landing/SiteHeader'
import { SiteFooter } from '@/app/components/landing/SiteFooter'

export const metadata: Metadata = {
  title: 'CBAM Insights — EU Carbon Border Adjustment News & Guides',
  description: 'Expert guides, regulatory updates, and country-specific resources on EU CBAM compliance, ETS, and carbon certificate trading.',
  openGraph: {
    title: 'CBAM Insights | Carbonis',
    description: 'Expert guides on EU CBAM compliance, ETS, and carbon certificate trading.',
    type: 'website',
  },
}

const ALL_CATEGORIES: ArticleCategory[] = ['regulation', 'how-to', 'country', 'industry', 'market', 'platform']

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const { bg, color } = CATEGORY_COLORS[category]
  return (
    <span style={{ background: bg, color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.03em' }}>
      {CATEGORY_LABELS[category]}
    </span>
  )
}

function ArticleCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <Link href={`/insights/${article.slug}`} style={{ textDecoration: 'none' }}>
      <article style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        transition: 'box-shadow 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        <CategoryBadge category={article.category} />
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, margin: 0 }}>
          {article.title}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.excerpt}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
          <span>{article.author}</span>
          {date && <><span>·</span><span>{date}</span></>}
          <span>·</span>
          <span>{article.reading_time_min} min read</span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#265CFF' }}>Read more →</span>
      </article>
    </Link>
  )
}

function EmptyState() {
  return (
    <div style={{ gridColumn: '1 / -1', padding: '64px 32px', textAlign: 'center' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
        <rect x="4" y="4" width="40" height="40" rx="6" stroke="#e2e8f0" strokeWidth="2"/>
        <path d="M12 16h24M12 24h18M12 32h12" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p style={{ fontSize: '15px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>No articles published yet</p>
      <p style={{ fontSize: '13px', color: '#cbd5e1', maxWidth: '320px', margin: '0 auto 24px' }}>
        Be the first to know when we publish CBAM guides, country reports, and market updates.
      </p>
      <Link
        href="/register"
        style={{ display: 'inline-block', background: '#265CFF', color: 'white', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
      >
        Create free account →
      </Link>
    </div>
  )
}

export default async function InsightsPage() {
  const supabase = createAdminClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const list = (articles ?? []) as Article[]

  return (
    <>
      <SiteHeader />
      <main style={{ background: '#F8FAFC', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '56px 24px 40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: '#265CFF', textTransform: 'uppercase', marginBottom: '12px' }}>
              CBAM Insights
            </p>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '16px' }}>
              EU Carbon Regulation.<br />Explained for practitioners.
            </h1>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
              Guides, country reports, and market updates on CBAM, ETS, and carbon certificate trading — written by compliance specialists.
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px', overflowX: 'auto', padding: '0 0 1px' }}>
            {(['all', ...ALL_CATEGORIES] as const).map((cat) => {
              const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat]
              const count = cat === 'all' ? list.length : list.filter(a => a.category === cat).length
              return (
                <span key={cat} style={{
                  padding: '14px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                  borderBottom: '2px solid transparent',
                }}>
                  {label} {count > 0 && <span style={{ color: '#94a3b8', fontSize: '11px' }}>({count})</span>}
                </span>
              )
            })}
          </div>
        </div>

        {/* Articles grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {list.length === 0 ? <EmptyState /> : list.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>

      </main>
      <SiteFooter />
    </>
  )
}
