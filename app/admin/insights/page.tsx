export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Article, ArticleCategory } from '@/lib/types/article'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types/article'

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const { bg, color } = CATEGORY_COLORS[category]
  return (
    <span style={{ background: bg, color, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
      {CATEGORY_LABELS[category]}
    </span>
  )
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span style={{
      background: published ? '#dcfce7' : '#f1f5f9',
      color: published ? '#15803d' : '#64748b',
      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
    }}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

export default async function AdminInsightsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const articles = (data ?? []) as Article[]

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Insights</h1>
        <Link
          href="/admin/insights/new"
          style={{ background: '#265CFF', color: 'white', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
        >
          + New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>No articles yet. Create your first one.</p>
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => {
                const date = a.published_at ?? a.created_at
                return (
                  <tr key={a.id} style={{ borderBottom: i < articles.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: 500, maxWidth: '320px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>/insights/{a.slug}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}><CategoryBadge category={a.category} /></td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge published={a.is_published} /></td>
                    <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link href={`/admin/insights/${a.id}/edit`} style={{ color: '#265CFF', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                          Edit
                        </Link>
                        <AdminArticleActions articleId={a.id} isPublished={a.is_published} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Client component for publish toggle + delete
function AdminArticleActions({ articleId, isPublished }: { articleId: string; isPublished: boolean }) {
  return (
    <PublishToggle articleId={articleId} isPublished={isPublished} />
  )
}

// Separate client component file would be cleaner but inline works for now
import { PublishToggle } from './_components/PublishToggle'
