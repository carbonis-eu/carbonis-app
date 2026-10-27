export type ArticleCategory =
  | 'regulation'
  | 'how-to'
  | 'country'
  | 'industry'
  | 'market'
  | 'platform'

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  'regulation': 'Regulation',
  'how-to': 'How-to Guide',
  'country': 'Country Guide',
  'industry': 'Industry',
  'market': 'Market Update',
  'platform': 'Platform Update',
}

export const CATEGORY_COLORS: Record<ArticleCategory, { bg: string; color: string }> = {
  'regulation': { bg: '#dbeafe', color: '#1e40af' },
  'how-to':     { bg: '#dcfce7', color: '#15803d' },
  'country':    { bg: '#f3e8ff', color: '#7e22ce' },
  'industry':   { bg: '#fef9c3', color: '#b45309' },
  'market':     { bg: '#fee2e2', color: '#b91c1c' },
  'platform':   { bg: '#e0f2fe', color: '#0369a1' },
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  author: string
  published_at: string | null
  is_published: boolean
  hero_image_url: string | null
  tags: string[]
  geo_targets: string[]
  reading_time_min: number
  created_at: string
  updated_at: string
}
