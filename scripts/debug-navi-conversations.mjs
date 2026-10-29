import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('=== Navi Conversations Debug ===\n')

// 1. Check how many rows exist
const { data: rows, error: fetchErr } = await supabase
  .from('navi_conversations')
  .select('id, session_id, lang, country, first_question, created_at')
  .order('created_at', { ascending: false })
  .limit(5)

console.log('Rows in table:', rows?.length ?? 0, fetchErr ? `(error: ${fetchErr.message})` : '')
if (rows?.length) {
  rows.forEach(r => console.log(' -', r.session_id?.slice(0, 20), '|', r.country, '|', r.lang, '|', r.first_question?.slice(0, 50)))
}

// 2. Try a direct insert (no upsert) to see if table is writable
const testSessionId = 'debug-test-' + Date.now()
const { data: ins, error: insErr } = await supabase
  .from('navi_conversations')
  .insert({
    session_id: testSessionId,
    messages: [{ role: 'user', content: 'debug test' }],
    country: 'SI',
    city: 'Ljubljana',
    lang: 'sl',
    first_question: 'debug test question',
  })
  .select()

console.log('\nInsert test:', insErr ? `FAILED: ${insErr.message}` : 'OK ✓')

// 3. Try upsert (onConflict session_id)
const { error: upsertErr } = await supabase
  .from('navi_conversations')
  .upsert({ session_id: testSessionId, messages: [{ role: 'user', content: 'upsert test' }], updated_at: new Date().toISOString() }, { onConflict: 'session_id' })

console.log('Upsert test:', upsertErr ? `FAILED: ${upsertErr.message}` : 'OK ✓')

// 4. Cleanup
await supabase.from('navi_conversations').delete().eq('session_id', testSessionId)
console.log('Cleanup done.\n')

// 5. Summary
if (insErr) {
  console.log('❌ TABLE NOT WRITABLE - run this SQL in Supabase:')
  console.log('GRANT ALL ON TABLE public.navi_conversations TO service_role;')
} else if (upsertErr) {
  console.log('❌ UPSERT FAILS - missing UNIQUE constraint. Run this SQL:')
  console.log('ALTER TABLE public.navi_conversations ADD CONSTRAINT navi_conversations_session_id_key UNIQUE (session_id);')
} else {
  console.log('✓ Table OK. If no rows, Navi conversations are not being triggered yet.')
}
