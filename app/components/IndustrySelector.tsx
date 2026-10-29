'use client'

import { useState } from 'react'

const INDUSTRIES = [
  { id: 'avtoservis', emoji: '🔧', label: 'Avtoservisi', pain: 'pasivna baza', metric: '7.500 €/mes', detail: '200 strank × 15% × 250€' },
  { id: 'kozmetika', emoji: '💅', label: 'Kozmetika & saloni', pain: 'prazni termini', metric: '2.700 €/mes', detail: '300 strank × 15% × 60€' },
  { id: 'fitnes', emoji: '💪', label: 'Fitnes studii', pain: 'odpisane članarine', metric: '1.147 €/mes', detail: '150 strank × 17% × 45€' },
  { id: 'gostinci', emoji: '🍽️', label: 'Gostinci', pain: 'prazni termini', metric: '2.100 €/mes', detail: '400 gostov × 15% × 35€' },
  { id: 'nepremicnine', emoji: '🏠', label: 'Nepremičnine', pain: 'leadi v CRM-u', metric: '30.000 € potenciala', detail: '200 kontaktov × 6% × 2.500€' },
  { id: 'ordinacije', emoji: '🏥', label: 'Ordinacije', pain: 'prazni termini', metric: '4.800 €/mes', detail: '400 pacientov × 15% × 80€' },
]

const PAINS: Record<string, string[]> = {
  avtoservis:   ['80% strank ne pride na naslednji servis brez opomnika', 'Vsak neodgovorjen klic je izgubljena stranka', 'Zadovoljni molčijo, nezadovoljni pišejo ocene'],
  kozmetika:    ['3 prazni termini/teden = 150 € manj vsak teden', 'Stranke ki so bile navdušene, preprosto izginejo', 'Cel dan odgovarjate na WhatsApp namesto da delate'],
  fitnes:       ['Pridobitev novega člana stane 5× več kot ohranitev starega', 'Prazni termini v grupnih vadbah', 'Novi člani vas ne najdejo online'],
  gostinci:     ['Nevidni ko gostje iščejo kje jesti', 'Prazne mize v slabih terminih', 'En razočaran gost napiše roman, 50 zadovoljnih ne napiše nič'],
  nepremicnine: ['Stari leadi gnijejo v CRM-u — nihče jih ne kontaktira', 'Vsak dan v administraciji namesto pri strankah', 'Novi kupci vas ne najdejo brez priporočila'],
  ordinacije:   ['60% pacientov ne pride na kontrolo brez opomnika', 'Receptorka kliče namesto da sprejema paciente', 'Odpovedi zadnji hip uničijo cel dan'],
}

const SOLUTIONS: Record<string, string[]> = {
  avtoservis:   ['Vsaka stranka ki 6+ mes ni bila dobi sporočilo z vašim imenom', 'Vsak klic je sprejet, vsak termin dogovorjen — tudi ko ste pod avtomobilom', 'Po vsakem servisu stranka dobi prošnjo za oceno — Google profil raste sam'],
  kozmetika:    ['Stranka dobi osebno sporočilo točno ob pravem času — "Minilo je 6 tednov..."', 'Naročanje poteka 24/7 brez vas — termin pade v vaš urnik', 'Vsaka stranka dobi 3 sporočila preden obupamo'],
  fitnes:       ['Vsak bivši član dobi personalizirano ponudbo ob pravem trenutku', 'Vaš studio na vrhu ko iščejo fitnes v vašem mestu', 'Zadovoljni člani sami pridobivajo nove'],
  gostinci:     ['Prazne termine zapolnimo s starimi gosti pred slabimi termini', 'Vaš lokal na vrhu AI priporočil — brez plačanega oglaševanja', 'Zadovoljni gostje pišejo ocene namesto vas'],
  nepremicnine: ['Vsak stari lead dobi personalizirano sporočilo — pravi trenutek, brez vašega dela', 'Vi dobite samo resne kupce — sistem kvalificira, vi zaključujete posle', 'Vaša agencija prva priporočena v AI iskaljih'],
  ordinacije:   ['Vsak pacient dobi opomnik ob pravem času — sistem to naredi namesto receptorke', 'Odpovedi se zapolnijo avtomatično — čakalna lista se kontaktira takoj', 'Naročanje deluje 24/7 — pacient se naroči zvečer, termin pade v urnik'],
}

export default function IndustrySelector() {
  const [selected, setSelected] = useState<string | null>(null)
  const ind = selected ? INDUSTRIES.find(i => i.id === selected) : null
  const cobalt = '#356AE6'
  const navy = '#102A56'

  const openVera = () => {
    const btn = document.querySelector('[data-vera-open]') as HTMLButtonElement | null
    btn?.click()
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {INDUSTRIES.map(ind => (
          <button
            key={ind.id}
            onClick={() => {
              setSelected(ind.id)
              setTimeout(() => document.getElementById('industry-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
            }}
            className="it"
            style={{
              padding: '20px 14px',
              borderRadius: '12px',
              border: `1.5px solid ${selected === ind.id ? cobalt : '#e2e8f0'}`,
              background: selected === ind.id ? '#EEF2FF' : 'white',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>{ind.emoji}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: selected === ind.id ? cobalt : navy }}>{ind.label}</div>
          </button>
        ))}
      </div>

      {ind && selected && (
        <div id="industry-detail" style={{ border: `1.5px solid ${cobalt}20`, borderRadius: '14px', overflow: 'hidden', background: 'white' }}>
          <div style={{ background: navy, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ color: '#93c5fd', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{ind.label}</p>
              <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>Ocena potenciala: {ind.metric}</h3>
              <p style={{ color: '#93c5fd', fontSize: '13px', marginTop: '6px', margin: '6px 0 0' }}>{ind.detail} · ocena, ni zagotovilo</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 18px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ color: '#4ade80', fontSize: '24px', fontWeight: 800 }}>{ind.metric}</div>
              <div style={{ color: '#93c5fd', fontSize: '12px' }}>ocena potenciala</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', padding: '0' }}>
            <div style={{ padding: '24px 28px', borderRight: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Brez sistema</p>
              {(PAINS[selected] || []).map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#374151', lineHeight: 1.5 }}>
                  <span style={{ color: '#dc2626', flexShrink: 0, fontWeight: 700 }}>✗</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Z Carbonis</p>
              {(SOLUTIONS[selected] || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#374151', lineHeight: 1.5 }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, fontWeight: 700 }}>✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px 28px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Brezplačen pregled vaše situacije. Brez obveznosti.</p>
            <button
              onClick={openVera}
              style={{ background: cobalt, color: 'white', fontWeight: 700, fontSize: '14px', padding: '11px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Preverite za {ind.label.toLowerCase()} →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
