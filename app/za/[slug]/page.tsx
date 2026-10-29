export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import VeraChat from './_components/VeraChat'

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40)
}

const INDUSTRY_LABELS: Record<string, string> = {
  avtoservis: 'avtoservis',
  kozmetika: 'kozmetični salon',
  fitnes: 'fitnes center',
  gostinstvo: 'restavracijo / gostinski lokal',
  nepremicnine: 'nepremičninsko agencijo',
  ordinacija: 'zdravstveno ordinacijo',
}

const BENEFITS: Record<string, string[]> = {
  avtoservis:   ['Več klicev iz Google Maps', 'Avtomatsko zbiranje ocen po servisu', 'Manj izgubljenih strank'],
  kozmetika:    ['Več rezervacij iz spleta', 'Zvestoba obstoječih strank', 'Avtomatski opomniki'],
  fitnes:       ['Boljša vidnost v Google Maps', 'Manj odpisov členarij', 'Pridobivanje novih članov'],
  gostinstvo:   ['Boljša uvrstitev v Google', 'Odgovarjanje na ocene', 'Več novih gostov'],
  nepremicnine: ['Zaupanje potencialnih kupcev', 'Boljša online reputacija', 'Več priporočil'],
  ordinacija:   ['Zaupanje novih pacientov', 'Zbiranje pohval', 'Boljša uvrstitev'],
}

export default async function ZaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = createAdminClient()

  const { data: all } = await db
    .from('prospects')
    .select('id, company_name, city, industry, google_rating, google_reviews_count, pain_points, ai_notes, recommended_package, email')

  const prospect = (all ?? []).find(p => makeSlug(p.company_name) === slug)

  if (!prospect) notFound()

  const industryLabel = INDUSTRY_LABELS[prospect.industry ?? ''] ?? 'podjetje'
  const benefits = BENEFITS[prospect.industry ?? ''] ?? ['Boljša reputacija', 'Več strank', 'Prihranek časa']
  const ratingGap = prospect.google_rating ? (4.6 - prospect.google_rating).toFixed(1) : null
  const potentialExtra = prospect.google_reviews_count
    ? Math.round(prospect.google_reviews_count * 0.12)
    : null

  // Track visit
  await db.from('prospects').update({
    last_action_at: new Date().toISOString(),
  }).eq('id', prospect.id)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px' }}>

      {/* Header */}
      <div style={{ background: '#0f2d5a', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>Carbonis</span>
        <span style={{ color: '#93c5fd', fontSize: '13px' }}>EU Compliance</span>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f2d5a 0%, #1e4080 100%)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ color: '#93c5fd', fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Brezplačna analiza
        </p>
        <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>
          {prospect.company_name}
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: '15px', margin: 0 }}>
          Personalizirana analiza za vašo {industryLabel}
          {prospect.city ? ` v ${prospect.city}` : ''}
        </p>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 16px' }}>

        {/* Rating card */}
        {prospect.google_rating && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginTop: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Vaša trenutna situacija</p>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: prospect.google_rating >= 4.5 ? '#16a34a' : prospect.google_rating >= 4.0 ? '#d97706' : '#dc2626' }}>
                  {prospect.google_rating}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Google ocena</div>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }}/>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>{prospect.google_reviews_count ?? 0}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>ocen skupaj</div>
              </div>
              {ratingGap && parseFloat(ratingGap) > 0 && (
                <>
                  <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }}/>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#dc2626' }}>+{ratingGap}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>do top konkurence</div>
                  </div>
                </>
              )}
            </div>
            {potentialExtra && (
              <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '12px 16px', marginTop: '16px' }}>
                <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                  ⚠️ Ocenjujemo, da pri trenutnem ratingu izgubite <strong>~{potentialExtra} potencialnih strank na mesec</strong>, ki gredo h konkurenci z boljšo oceno.
                </p>
              </div>
            )}
          </div>
        )}

        {/* What we do */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginTop: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Kaj vam Carbonis prinese</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#16a34a', fontSize: '16px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '15px', color: '#0f172a' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#0f2d5a', borderRadius: '12px', padding: '28px 24px', marginTop: '16px', textAlign: 'center' }}>
          <p style={{ color: '#bfdbfe', fontSize: '13px', marginBottom: '8px' }}>Brezplačen 15-min klic</p>
          <p style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '20px', lineHeight: 1.3 }}>
            Pokažemo vam točno kaj spremeniti za več strank
          </p>
          <a
            href={`mailto:info@carbonis.eu?subject=Zanima me brezplacna analiza za ${encodeURIComponent(prospect.company_name)}`}
            style={{ display: 'inline-block', background: '#3b82f6', color: 'white', fontWeight: 700, fontSize: '16px', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none' }}
          >
            Pišite nam
          </a>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '12px' }}>info@carbonis.eu · brezplačen klic ali email</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '24px' }}>
          Carbonis d.o.o. · EU Carbon Compliance · <a href="https://carbonis.eu" style={{ color: '#94a3b8' }}>carbonis.eu</a>
        </p>
      </div>

      <VeraChat
        companyName={prospect.company_name}
        prospectContext={[
          `Podjetje: ${prospect.company_name}`,
          `Branža: ${prospect.industry ?? 'lokalno podjetje'}`,
          `Mesto: ${prospect.city ?? 'Slovenija'}`,
          `Google ocena: ${prospect.google_rating ?? 'ni podatka'} (${prospect.google_reviews_count ?? 0} ocen)`,
          `Ugotovljeni problemi: ${prospect.pain_points?.join(', ') ?? prospect.ai_notes ?? 'splošna optimizacija'}`,
          `Priporočen paket: ${prospect.recommended_package ?? 'PRO Compliance'}`,
        ].join('\n')}
      />
    </div>
  )
}
