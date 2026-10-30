'use client'

import { useState } from 'react'

const navy = '#102A56'
const cobalt = '#356AE6'

const ICONS: Record<string, React.ReactNode> = {
  avtoservis: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  kozmetika: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>
    </svg>
  ),
  fitnes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  gostinstvo: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  ),
  nepremicnine: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  ordinacije: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
}

const INDUSTRIES = [
  { id: 'avtoservis',   label: 'Avtoservisi',        metric: '7.500 €/mes',         detail: '200 strank × 15% × 250 €' },
  { id: 'kozmetika',    label: 'Kozmetika & saloni', metric: '2.700 €/mes',         detail: '300 strank × 15% × 60 €' },
  { id: 'fitnes',       label: 'Fitnes studii',      metric: '1.147 €/mes',         detail: '150 strank × 17% × 45 €' },
  { id: 'gostinstvo',   label: 'Gostinci',           metric: '2.100 €/mes',         detail: '400 gostov × 15% × 35 €' },
  { id: 'nepremicnine', label: 'Nepremičnine',       metric: '30.000 € potenciala', detail: '200 kontaktov × 6% × 2.500 €' },
  { id: 'ordinacije',   label: 'Ordinacije',         metric: '4.800 €/mes',         detail: '400 pacientov × 15% × 80 €' },
]

const PAINS: Record<string, string[]> = {
  avtoservis:   ['80% strank ne pride na naslednji servis brez opomnika', 'Vsak neodgovorjen klic je izgubljena stranka', 'Zadovoljni molčijo, nezadovoljni pišejo ocene'],
  kozmetika:    ['3 prazni termini/teden = 150 € manj vsak teden', 'Stranke ki so bile navdušene, preprosto izginejo', 'Cel dan odgovarjate na WhatsApp namesto da delate'],
  fitnes:       ['Pridobitev novega člana stane 5× več kot ohranitev starega', 'Prazni termini v grupnih vadbah', 'Novi člani vas ne najdejo online'],
  gostinstvo:   ['Nevidni ko gostje iščejo kje jesti', 'Prazne mize v slabih terminih', 'En razočaran gost napiše roman, 50 zadovoljnih ne napiše nič'],
  nepremicnine: ['Stari leadi gnijejo v CRM-u — nihče jih ne kontaktira', 'Vsak dan v administraciji namesto pri strankah', 'Novi kupci vas ne najdejo brez priporočila'],
  ordinacije:   ['60% pacientov ne pride na kontrolo brez opomnika', 'Receptorka kliče namesto da sprejema paciente', 'Odpovedi zadnji hip uničijo cel dan'],
}

const SOLUTIONS: Record<string, string[]> = {
  avtoservis:   ['Vsaka stranka ki 6+ mes ni bila dobi sporočilo z vašim imenom', 'Vsak klic je sprejet, vsak termin dogovorjen — tudi ko ste pod avtomobilom', 'Po vsakem servisu stranka dobi prošnjo za oceno — Google profil raste sam'],
  kozmetika:    ['Stranka dobi osebno sporočilo točno ob pravem času — "Minilo je 6 tednov..."', 'Naročanje poteka 24/7 brez vas — termin pade v vaš urnik', 'Vsaka stranka dobi 3 sporočila preden obupamo'],
  fitnes:       ['Vsak bivši član dobi personalizirano ponudbo ob pravem trenutku', 'Vaš studio na vrhu ko iščejo fitnes v vašem mestu', 'Zadovoljni člani sami pridobivajo nove'],
  gostinstvo:   ['Prazne termine zapolnimo s starimi gosti pred slabimi termini', 'Vaš lokal na vrhu AI priporočil — brez plačanega oglaševanja', 'Zadovoljni gostje pišejo ocene namesto vas'],
  nepremicnine: ['Vsak stari lead dobi personalizirano sporočilo — pravi trenutek, brez vašega dela', 'Vi dobite samo resne kupce — sistem kvalificira, vi zaključujete posle', 'Vaša agencija prva priporočena v AI iskaljih'],
  ordinacije:   ['Vsak pacient dobi opomnik ob pravem času — sistem to naredi namesto receptorke', 'Odpovedi se zapolnijo avtomatično — čakalna lista se kontaktira takoj', 'Naročanje deluje 24/7 — pacient se naroči zvečer, termin pade v urnik'],
}

export default function IndustrySelector() {
  const [selected, setSelected] = useState<string>('avtoservis')
  const ind = INDUSTRIES.find(i => i.id === selected)!

  const openVera = () => {
    const btn = document.querySelector('[data-vera-open]') as HTMLButtonElement | null
    btn?.click()
  }

  return (
    <div>
      <style>{`
        .ind-tab { transition: all 0.18s; border: 1.5px solid #D1D8E4; background: white; color: #374151; }
        .ind-tab:hover { border-color: ${cobalt}; color: ${cobalt}; }
        .ind-tab:hover svg { stroke: ${cobalt}; }
        .ind-tab.active { border-color: ${cobalt}; background: ${cobalt}; color: white; }
        .ind-tab.active svg { stroke: white; }
        .ind-tab svg { stroke: #6B7280; transition: stroke 0.18s; }
        .ind-cta-btn:hover { background: #2856cc !important; }
      `}</style>

      {/* Tab strip */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {INDUSTRIES.map(i => (
          <button
            key={i.id}
            onClick={() => setSelected(i.id)}
            className={`ind-tab${selected === i.id ? ' active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '40px',
              fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {ICONS[i.id]}
            {i.label}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{
        border: `1.5px solid ${cobalt}18`,
        borderRadius: '18px', overflow: 'hidden', background: 'white',
        boxShadow: '0 4px 24px rgba(53,106,230,0.07)',
      }}>
        {/* Header */}
        <div style={{
          background: navy, padding: '28px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ color: '#93c5fd', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{ind.label}</p>
            <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>Ocena potenciala: {ind.metric}</h3>
            <p style={{ color: '#93c5fd', fontSize: '13px', marginTop: '6px', opacity: 0.85 }}>{ind.detail} · <em>ocena, ni zagotovilo</em></p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.07)', borderRadius: '14px',
            padding: '16px 24px', flexShrink: 0, textAlign: 'center', minWidth: '140px',
          }}>
            <div style={{ color: '#4ade80', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {ind.metric.split(' ')[0]}
            </div>
            <div style={{ color: '#93c5fd', fontSize: '11px', marginTop: '4px' }}>
              {ind.metric.includes('potencial') ? 'potencial' : 'mes · ocena'}
            </div>
          </div>
        </div>

        {/* Before / After */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ padding: '28px 32px', borderRight: '1px solid #F1F5F9' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#FEF2F2', color: '#DC2626',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: '6px', marginBottom: '20px',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round"/></svg>
              Brez sistema
            </div>
            {(PAINS[selected] || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#374151', lineHeight: 1.55 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M3 3l10 10M13 3L3 13" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '28px 32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#F0FDF4', color: '#16A34A',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: '6px', marginBottom: '20px',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Z Carbonis
            </div>
            {(SOLUTIONS[selected] || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#374151', lineHeight: 1.55 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M2 8l4 4 8-8" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          padding: '20px 32px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Brezplačen pregled vaše situacije. Brez obveznosti.</p>
          <button
            onClick={openVera}
            className="ind-cta-btn"
            style={{
              background: cobalt, color: 'white', fontWeight: 700, fontSize: '14px',
              padding: '11px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s',
            }}
          >
            Preverite za {ind.label.toLowerCase()}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
