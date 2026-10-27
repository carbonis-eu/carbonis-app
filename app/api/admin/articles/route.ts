import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ArticleCategory } from '@/lib/types/article'

const VALID_CATEGORIES: ArticleCategory[] = ['regulation', 'how-to', 'country', 'industry', 'market', 'platform']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { db: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const metaRole = (user.app_metadata as Record<string, string> | null)?.role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (metaRole !== 'admin' && profile?.role !== 'admin') return { db: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { db: createAdminClient(), error: null }
}

export async function POST(request: NextRequest) {
  const { db, error } = await requireAdmin()
  if (error) return error

  const body = await request.json() as Record<string, unknown>
  const { title, slug, excerpt, content, category, author, hero_image_url, tags, geo_targets, reading_time_min } = body

  if (!title || !slug || !excerpt || !category) {
    return NextResponse.json({ error: 'title, slug, excerpt and category are required' }, { status: 400 })
  }
  if (!VALID_CATEGORIES.includes(category as ArticleCategory)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const { data, error: dbError } = await db!.from('articles').insert({
    title,
    slug,
    excerpt,
    content: content ?? '',
    category,
    author: author ?? 'Carbonis Team',
    hero_image_url: hero_image_url ?? null,
    tags: Array.isArray(tags) ? tags : [],
    geo_targets: Array.isArray(geo_targets) ? geo_targets : [],
    reading_time_min: Number(reading_time_min) || 5,
    is_published: false,
  }).select().single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { db, error } = await requireAdmin()
  if (error) return error

  const body = await request.json() as Record<string, unknown>
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  if (updates.is_published === true) {
    (updates as Record<string, unknown>).published_at = new Date().toISOString()
  }
  if (updates.is_published === false) {
    (updates as Record<string, unknown>).published_at = null
  }

  const { data, error: dbError } = await db!.from('articles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { db, error } = await requireAdmin()
  if (error) return error

  const { id } = await request.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error: dbError } = await db!.from('articles').delete().eq('id', id)
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
