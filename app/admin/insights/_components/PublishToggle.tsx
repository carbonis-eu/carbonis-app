'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PublishToggle({ articleId, isPublished }: { articleId: string; isPublished: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: articleId, is_published: !isPublished }),
    })
    router.refresh()
    setLoading(false)
  }

  async function remove() {
    if (!confirm('Delete this article? This cannot be undone.')) return
    setLoading(true)
    await fetch('/api/admin/articles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: articleId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={toggle}
        disabled={loading}
        style={{ color: isPublished ? '#ca8a04' : '#15803d', fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={remove}
        disabled={loading}
        style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Delete
      </button>
    </>
  )
}
