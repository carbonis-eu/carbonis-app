import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const get = (key) => env.match(new RegExp(`^${key}=(.+)$`, 'm'))?.[1]?.trim()

const sb = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false }
})

const slug = process.argv[2]
if (!slug) { console.error('Usage: node delete-article.mjs <slug>'); process.exit(1) }

const { error } = await sb.from('articles').delete().eq('slug', slug)
if (error) { console.error('Error:', error.message); process.exit(1) }
console.log('Deleted:', slug)
