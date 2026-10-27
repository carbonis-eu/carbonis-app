'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ArticleCategory } from '@/lib/types/article'
import { CATEGORY_LABELS } from '@/lib/types/article'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ArticleCategory[]
const GEO_OPTIONS = ['DE', 'FR', 'PL', 'IT', 'NL', 'CZ', 'ES', 'BE', 'AT', 'SE']

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#0f172a', background: 'white', boxSizing: 'border-box' }

export default function NewArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle]           = useState('')
  const [slug, setSlug]             = useState('')
  const [excerpt, setExcerpt]       = useState('')
  const [content, setContent]       = useState('')
  const [category, setCategory]     = useState<ArticleCategory>('regulation')
  const [author, setAuthor]         = useState('Carbonis Team')
  const [heroUrl, setHeroUrl]       = useState('')
  const [tags, setTags]             = useState('')
  const [geoTargets, setGeoTargets] = useState<string[]>([])
  const [readingTime, setReadingTime] = useState(5)

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!slug || slug === slugify(title)) setSlug(slugify(v))
  }

  function toggleGeo(code: string) {
    setGeoTargets(prev => prev.includes(code) ? prev.filter(g => g !== code) : [...prev, code])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, slug, excerpt, content, category, author,
          hero_image_url: heroUrl || null,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          geo_targets: geoTargets,
          reading_time_min: readingTime,
        }),
      })
      if (!res.ok) {
        const j = await res.json() as { error: string }
        setError(j.error)
        return
      }
      router.push('/admin/insights')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '32px 28px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>New Article</h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Saved as draft — publish from the Insights list.</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={title} onChange={e => handleTitleChange(e.target.value)} required placeholder="What Is CBAM? The EU Carbon Border Adjustment Mechanism Explained" />
        </div>

        <div>
          <label style={labelStyle}>Slug *</label>
          <input style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} required placeholder="what-is-cbam-eu-carbon-border-adjustment" />
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>URL: /insights/{slug || '...'}</p>
        </div>

        <div>
          <label style={labelStyle}>Excerpt * (shown in listing)</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={excerpt} onChange={e => setExcerpt(e.target.value)} required placeholder="Two-sentence summary for the article card and meta description." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value as ArticleCategory)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '320px', fontFamily: 'monospace', fontSize: '12px' }} value={content} onChange={e => setContent(e.target.value)} placeholder="## Introduction&#10;&#10;Write your article in Markdown..." />
        </div>

        <div>
          <label style={labelStyle}>Hero image URL (optional)</label>
          <input style={inputStyle} type="url" value={heroUrl} onChange={e => setHeroUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} placeholder="CBAM, EU ETS, steel, Germany" />
          </div>
          <div>
            <label style={labelStyle}>Read (min)</label>
            <input style={inputStyle} type="number" min={1} max={60} value={readingTime} onChange={e => setReadingTime(Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Geo targets</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {GEO_OPTIONS.map(code => (
              <label key={code} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={geoTargets.includes(code)} onChange={() => toggleGeo(code)} />
                {code}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ background: '#265CFF', color: 'white', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            {saving ? 'Saving…' : 'Save as draft'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/insights')}
            style={{ background: 'white', color: '#64748b', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
