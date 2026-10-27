import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://carbonis.eu'
  const now = new Date()

  const static_urls: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/cbam`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('slug, updated_at')
      .eq('is_published', true)

    const article_urls: MetadataRoute.Sitemap = (data ?? []).map((a: { slug: string; updated_at: string }) => ({
      url: `${base}/insights/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...static_urls, ...article_urls]
  } catch {
    return static_urls
  }
}
