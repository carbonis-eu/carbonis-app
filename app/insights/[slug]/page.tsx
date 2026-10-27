import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Article, ArticleCategory } from '@/lib/types/article'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types/article'
import { SiteHeader } from '@/app/components/landing/SiteHeader'
import { SiteFooter } from '@/app/components/landing/SiteFooter'

export const dynamic = 'force-dynamic'

// Simple markdown renderer — no external library
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^(?!<[hul/]).+$/gm, (line) => line.trim() ? `<p>${line}</p>` : '')
    .trim()
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as Article | null
}

async function getRelated(category: ArticleCategory, currentSlug: string): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('id, slug, title, category, reading_time_min, published_at')
    .eq('is_published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .limit(3)
  return (data ?? []) as Article[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article Not Found | Carbonis' }
  return {
    title: `${article.title} | CBAM Insights`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: [article.author],
      ...(article.hero_image_url ? { images: [{ url: article.hero_image_url }] } : {}),
    },
  }
}

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const { bg, color } = CATEGORY_COLORS[category]
  return (
    <span style={{ background: bg, color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px' }}>
      {CATEGORY_LABELS[category]}
    </span>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const related = await getRelated(article.category, slug)
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const html = renderMarkdown(article.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: 'Carbonis' },
    publisher: { '@type': 'Organization', name: 'Carbonis', url: 'https://carbonis.eu' },
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at,
    ...(article.hero_image_url ? { image: article.hero_image_url } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ background: '#F8FAFC', minHeight: '100vh' }}>

        {/* Hero */}
        {article.hero_image_url ? (
          <div style={{ height: '320px', background: `url(${article.hero_image_url}) center/cover`, borderBottom: '1px solid #e2e8f0' }} />
        ) : (
          <div style={{ height: '8px', background: 'linear-gradient(90deg, #265CFF 0%, #60a5fa 100%)' }} />
        )}

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px', alignItems: 'start' }}>

          {/* Main content */}
          <article>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>
              <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <Link href="/insights" style={{ color: '#94a3b8', textDecoration: 'none' }}>CBAM Insights</Link>
              <span>›</span>
              <span style={{ color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{article.title}</span>
            </nav>

            <CategoryBadge category={article.category} />

            <h1 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, margin: '16px 0 12px' }}>
              {article.title}
            </h1>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#94a3b8', marginBottom: '32px', flexWrap: 'wrap' }}>
              <span>{article.author}</span>
              {date && <><span>·</span><span>{date}</span></>}
              <span>·</span>
              <span>{article.reading_time_min} min read</span>
            </div>

            {/* Article body */}
            <div
              style={{ fontSize: '15px', lineHeight: 1.75, color: '#374151' }}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {article.tags.map(tag => (
                  <span key={tag} style={{ background: '#f1f5f9', color: '#64748b', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: '48px', background: '#EEF2FF', border: '1px solid #c7d2fe', borderRadius: '14px', padding: '28px 32px' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
                Ready to simplify your CBAM compliance?
              </p>
              <p style={{ fontSize: '14px', color: '#3730a3', marginBottom: '20px' }}>
                Start a 30-day free trial — no credit card required.
              </p>
              <Link href="/register" style={{ display: 'inline-block', background: '#265CFF', color: 'white', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Start free trial →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Category</p>
              <CategoryBadge category={article.category} />
              {article.geo_targets.length > 0 && (
                <>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 8px' }}>Relevant for</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {article.geo_targets.map(g => (
                      <span key={g} style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>{g}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {related.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Related articles</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', margin: 0, padding: 0 }}>
                  {related.map(r => (
                    <li key={r.slug}>
                      <Link href={`/insights/${r.slug}`} style={{ fontSize: '13px', fontWeight: 500, color: '#265CFF', textDecoration: 'none', lineHeight: 1.4, display: 'block' }}>
                        {r.title}
                      </Link>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{r.reading_time_min} min read</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ background: '#0B2471', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>New to CBAM?</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', lineHeight: 1.5 }}>
                Calculate your CBAM liability in minutes with our free calculator.
              </p>
              <Link href="/cbam" style={{ display: 'block', background: 'rgba(255,255,255,0.12)', color: 'white', padding: '8px 16px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                Try CBAM Calculator →
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
