'use client'

import { useState } from 'react'

const INDUSTRIES = [
  { id: 'avtoservis', emoji: '🔧', label: 'Avtoservisi' },
  { id: 'kozmetika', emoji: '💅', label: 'Kozmetika & saloni' },
  { id: 'fitnes', emoji: '💪', label: 'Fitnes studii' },
  { id: 'gostinci', emoji: '🍽️', label: 'Gostinci' },
  { id: 'nepremicnine', emoji: '🏠', label: 'Nepremičnine' },
  { id: 'ordinacije', emoji: '🏥', label: 'Ordinacije' },
]

const INDUSTRY_DATA: Record<string, {
  title: string
  intro: string
  pains: string[]
  solutions: string[]
  roi: { strank: string; procent: string; vrednost: string; skupaj: string }
  testimonial: { quote: string; author: string }
}> = {
  avtoservis: {
    title: 'Za avtomehanike in avtoservise',
    intro: 'Poznate ta občutek? Stranke pridejo enkrat na servis in jih nikoli več ne vidite. Telefon je tiho. Vi ste odličen mehanik — ne prodajalec.',
    pains: [
      '80% strank ne pride na naslednji servis brez opomnika',
      'Med delom ne morete dvigniti telefona — vsak neodgovorjen klic je izgubljena stranka',
      'Malo Google ocen čeprav ste odlični — nezadovoljni pišejo, zadovoljni molčijo',
    ],
    solutions: [
      'Vsaka stranka ki 6+ mes ni bila dobi sporočilo z vašim imenom — naroči se sama',
      'Vsak klic je sprejet, vsak termin dogovorjen — tudi ko ste pod avtomobilom',
      'Po vsakem servisu stranka dobi prošnjo za oceno — vaš Google profil raste sam',
    ],
    roi: { strank: '200', procent: '15%', vrednost: '250 €', skupaj: '7.500 €/mes' },
    testimonial: { quote: 'Nisem vedel da imam 340 strank ki so bile pri meni in 2+ leti niso prišle. Mesec dni po zagonu so se začele vračati.', author: 'Janez K., Avtoservis, Ljubljana' },
  },
  kozmetika: {
    title: 'Za kozmetične salone in frizerje',
    intro: 'Vsak prazen termin je denar ki ste ga izgubili. Stranke ki so bile navdušene so preprosto... izginile.',
    pains: [
      '3 prazni termini × 50 € = 150 € manj vsak teden',
      'Stranke ki so bile navdušene in izginile — nihče jih ni povabil nazaj',
      'Cel dan odgovarjate na WhatsApp namesto da delate',
    ],
    solutions: [
      'Stranka dobi osebno sporočilo točno ob pravem času — "Minilo je 6 tednov..."',
      'Naročanje poteka 24/7 brez vas — termin pade v vaš urnik',
      'Vsaka stranka dobi 3 sporočila preden obupamo — sistematično, brez vašega truda',
    ],
    roi: { strank: '300', procent: '15%', vrednost: '60 €', skupaj: '2.700 €/mes' },
    testimonial: { quote: 'Imela sem 280 strank ki so me sledile na Instagramu ampak nikoli prišle nazaj. Zdaj prihajajo. Same.', author: 'Maja T., Kozmetični salon, Zagreb' },
  },
  fitnes: {
    title: 'Za fitnes studie in centre',
    intro: 'Vsak član ki odide je izgubljena mesečna naročnina. Večina ni odšla ker so nezadovoljni — samo nihče jih ni prišel iskat.',
    pains: [
      'Pridobitev novega člana stane 5× več kot ohranjanje starega',
      'Prazni termini v grupnih vadbah — stroški enaki, prihodek ne',
      'Novi člani vas ne najdejo online — vaša konkurenca je tam, vi niste',
    ],
    solutions: [
      'Vsak bivši član dobi personalizirano ponudbo ob pravem trenutku',
      'Vaš studio na vrhu ko iščejo fitnes v vašem mestu',
      'Zadovoljni člani sami pridobivajo nove — sistem jih prosi za oceno in priporočilo',
    ],
    roi: { strank: '150 bivših', procent: '17%', vrednost: '45 €/mes', skupaj: '1.147 €/mes' },
    testimonial: { quote: '200 članov ki so odpovedali v zadnjih 2 letih. V prvem mesecu se jih je 31 vrnilo. Brez enega samega klica z naše strani.', author: 'Petra M., Fitnes studio, Split' },
  },
  gostinci: {
    title: 'Za restavracije in kavarne',
    intro: 'Gostje ki so bili navdušeni in nikoli več prišli. Ne zato ker niso bili zadovoljni — preprosto ste bili pozabljeni.',
    pains: [
      'Ste nevidni ko gostje iščejo kje jesti — AI iskalniki priporočijo konkurenco',
      'Prazne mize v slabih terminih — ponedeljek, torek, zgodnji večer',
      'En razočaran gost napiše roman, 50 zadovoljnih ne napiše nič',
    ],
    solutions: [
      'Prazne termine zapolnimo s starimi gosti — točno pred slabimi termini',
      'Vaš lokal na vrhu AI priporočil — brez plačanega oglaševanja',
      'Zadovoljni gostje pišejo ocene namesto vas',
    ],
    roi: { strank: '400', procent: '15%', vrednost: '35 €', skupaj: '2.100 €/mes' },
    testimonial: { quote: 'Preden sem uvedel ta sistem, so prazni termini bili moja nočna mora. Zdaj se zapolnijo sami, jaz pa se ukvarjam s kuho.', author: 'Petra K., Restavracija, Rijeka' },
  },
  nepremicnine: {
    title: 'Za nepremičninske agente in agencije',
    intro: 'V vašem CRM-u spi zlato. Stari kontakti ki so kdaj izrazili zanimanje — ampak takrat čas ni bil pravi. Zdaj je.',
    pains: [
      'Stari leadi gnijejo v CRM-u — nihče jih ne kontaktira',
      'Vsak dan v administraciji namesto pri strankah',
      'Novi kupci vas ne najdejo brez priporočila',
    ],
    solutions: [
      'Vsak stari lead dobi personalizirano sporočilo — pravi trenutek, brez vašega dela',
      'Vi dobite samo resne kupce — sistem kvalificira, vi zaključujete posle',
      'Vaša agencija prva priporočena v AI iskanjih',
    ],
    roi: { strank: '200 kontaktov', procent: '6%', vrednost: '2.500 € provizija', skupaj: '30.000 € potenciala' },
    testimonial: { quote: '180 kontaktov ki so vprašali za stanovanje pred letom in pol. V prvem mesecu 3 posli. To je 7.500 € provizij ki bi jih izgubil.', author: 'Rok P., Nepremičninski agent, Ljubljana' },
  },
  ordinacije: {
    title: 'Za zdravstvene ordinacije in klinike',
    intro: 'Vaš urnik bi moral biti zapolnjen mesece vnaprej. Ampak pacienti pozabijo, termini se odpovedujejo, receptorka kliče.',
    pains: [
      '60% pacientov ne pride na kontrolo brez opomnika — termini ostanejo prazni',
      'Receptorka kliče namesto da sprejema paciente — to ni njen namen',
      'Odpovedi zadnji hip uničijo cel dan — ni časa za zamenjavo',
    ],
    solutions: [
      'Vsak pacient dobi opomnik ob pravem času — sistem to naredi namesto receptorke',
      'Odpovedi se zapolnijo avtomatično — čakalna lista se kontaktira takoj',
      'Naročanje deluje 24/7 — pacient se naroči zvečer, termin pade v urnik',
    ],
    roi: { strank: '400 pacientov', procent: '15%', vrednost: '80 €', skupaj: '4.800 €/mes' },
    testimonial: { quote: 'Receptorka je porabila 3 ure na dan samo za klicanje. Zdaj tega ne počne več. Urnik pa je bolj zapolnjen kot kdajkoli.', author: 'Dr. Novak, Ordinacija, Maribor' },
  },
}

const FAQ = [
  { q: 'Kaj če nimam urejene baze strank?', a: 'Ni problema. Pošljite kar imate — Excel, seznam, foto papirja. Uredimo za vas.' },
  { q: 'Kako hitro vidim prve rezultate?', a: 'Prve odzive strank tipično vidite v 7–14 dneh. Garancija: 10 reaktiviranih strank v 60 dneh.' },
  { q: 'Ali bodo moje stranke vedele da jih kontaktira sistem?', a: 'Ne. Sporočila gredo z vašim imenom in vašo telefonsko številko. Za stranko ste to vi.' },
  { q: 'Kaj če odpovem?', a: 'Starter in Growth: odpoveste kadarkoli, brez kazni. Pro: 12-mesečna pogodba.' },
  { q: 'Ali so moji podatki varni?', a: 'Vsi podatki so shranjeni na EU strežnikih. GDPR skladnost je zagotovljena.' },
  { q: 'Kako poteka postavitev?', a: 'Izpolnite kratek vprašalnik (10 min). V 24 urah je sistem pripravljen. Nobenih tehničnih znanj ni potrebnih.' },
]

export default function HomePage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const ind = selectedIndustry ? INDUSTRY_DATA[selectedIndustry] : null

  const navy = '#0B2471'
  const cobalt = '#265CFF'

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', color: '#0f172a', background: 'white' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ color: navy, fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>Carbonis</span>
        </a>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px' }}>
          <a href="#kako-deluje" style={{ color: '#64748b', textDecoration: 'none' }}>Kako deluje</a>
          <a href="#paketi" style={{ color: '#64748b', textDecoration: 'none' }}>Paketi</a>
          <a href="#faq" style={{ color: '#64748b', textDecoration: 'none' }}>FAQ</a>
          <a href="/login" style={{ background: navy, color: 'white', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Prijava</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a3a8f 100%)`, padding: '80px 24px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: '#93c5fd', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>Za lokalna podjetja v Sloveniji in Hrvaški</p>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            Vaše stranke se vračajo same.<br />
            <span style={{ color: '#60a5fa' }}>Vaš urnik je zapolnjen.</span>
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.6, margin: '0 0 36px', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
            Medtem ko vi delate tisto v čemer ste najboljši, naš sistem skrbi da vas stranke ne pozabijo in da vaš telefon ne miruje.
          </p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {[['15–25%', 'starih strank se vrne'], ['4,8 ★', 'povprečna ocena po uvajanju'], ['30 dni', 'do prvih rezultatov']].map(([num, label]) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ color: '#60a5fa', fontSize: '24px', fontWeight: 800 }}>{num}</div>
                <div style={{ color: '#93c5fd', fontSize: '13px', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
          <a href="#panoge" style={{ display: 'inline-block', background: cobalt, color: 'white', fontWeight: 700, fontSize: '16px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(38,92,255,0.4)' }}>
            Preverite za svojo panogo →
          </a>
        </div>
      </section>

      {/* KAKO DELUJE */}
      <section id="kako-deluje" style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Proces</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: navy, marginBottom: '48px' }}>Kako deluje</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              ['01', 'Poveste nam o svojih strankah', 'Prinesete kar imate — seznam, Excel, ali kar koli drugega.'],
              ['02', 'Sistem se postavi za vas', 'V 24 urah je vse pripravljeno za vaše podjetje.'],
              ['03', 'Stare stranke se začnejo vračati', 'V 30 dneh vidite prve rezultate. V evrih.'],
              ['04', 'Sistem dela naprej sam', 'Vi se fokusirate na vaše delo. Ostalo je naše.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ color: cobalt, fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Korak {num}</div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: navy, marginBottom: '8px' }}>{title}</div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PANOGE */}
      <section id="panoge" style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Personalizirano za vas</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: navy, marginBottom: '8px' }}>Izberite svojo panogo</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '36px', fontSize: '15px' }}>in poglejte kako deluje točno za vas</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {INDUSTRIES.map(ind => (
              <button
                key={ind.id}
                onClick={() => { setSelectedIndustry(ind.id); setTimeout(() => document.getElementById('industry-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100) }}
                style={{
                  padding: '18px 12px', borderRadius: '10px', border: `2px solid ${selectedIndustry === ind.id ? cobalt : '#e2e8f0'}`,
                  background: selectedIndustry === ind.id ? '#EEF2FF' : 'white',
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{ind.emoji}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: selectedIndustry === ind.id ? cobalt : navy }}>{ind.label}</div>
              </button>
            ))}
          </div>

          {/* Personalizirana vsebina */}
          {ind && (
            <div id="industry-content" style={{ animation: 'fadeIn 0.3s ease', border: `1px solid ${cobalt}20`, borderRadius: '16px', overflow: 'hidden' }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
              <div style={{ background: navy, padding: '24px 28px' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 800, margin: 0 }}>{ind.title}</h3>
                <p style={{ color: '#bfdbfe', marginTop: '8px', margin: '8px 0 0', fontSize: '14px', lineHeight: 1.5 }}>{ind.intro}</p>
              </div>
              <div style={{ background: 'white', padding: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#dc2626', marginBottom: '12px' }}>Brez sistema</p>
                    {ind.pains.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '14px', color: '#374151' }}>
                        <span style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }}>✗</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#16a34a', marginBottom: '12px' }}>Z Carbonis</p>
                    {ind.solutions.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '14px', color: '#374151' }}>
                        <span style={{ color: '#16a34a', flexShrink: 0, marginTop: '1px' }}>✓</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROI */}
                <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '20px', marginTop: '24px' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#15803d', marginBottom: '12px' }}>ROI izračun</p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#dcfce7' }}>
                          {['Strank v bazi', 'Vrne se', 'Povpr. vrednost', 'Dodatni prihodek'].map(h => (
                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#166534' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px 12px' }}>{ind.roi.strank}</td>
                          <td style={{ padding: '8px 12px' }}>{ind.roi.procent}</td>
                          <td style={{ padding: '8px 12px' }}>{ind.roi.vrednost}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 800, color: '#15803d', fontSize: '16px' }}>{ind.roi.skupaj}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Testimonial */}
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '20px', marginTop: '16px', borderLeft: `3px solid ${cobalt}` }}>
                  <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 8px' }}>"{ind.testimonial.quote}"</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>— {ind.testimonial.author}</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button
                    onClick={() => { const w = document.querySelector('[data-vera-open]') as HTMLButtonElement; w?.click() }}
                    style={{ background: cobalt, color: 'white', fontWeight: 700, fontSize: '15px', padding: '13px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  >
                    Želim tak rezultat →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PAKETI */}
      <section id="paketi" style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Transparentne cene</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: navy, marginBottom: '8px' }}>Brez presenečenj</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '48px', fontSize: '15px' }}>Brez začetne postavitve. Odpoveste kadarkoli (razen Pro).</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {[
              {
                name: 'STARTER', price: '149', period: '/mes', badge: null,
                for: 'Majhna podjetja ki želijo preveriti ali sistem deluje',
                features: ['Reaktivacija starih strank (SMS)', 'Zbiranje Google ocen', 'Follow-up sekvence', 'Mini poročila'],
                missing: ['Voice klici', 'GEO vidljivost', 'Booking sistem'],
              },
              {
                name: 'GROWTH', price: '249', period: '/mes', badge: 'Najpopularnejši',
                for: 'Podjetja ki želijo rast na vseh kanalih',
                features: ['Vse iz Starter', 'Uvoz baze strank', 'GEO/AI vidljivost', 'Booking sistem', 'Polni dashboard + poročila', 'AI odgovori na ocene'],
                missing: ['Voice klici (outbound)'],
              },
              {
                name: 'PRO', price: '349', period: '/mes', badge: '12-mes. pogodba',
                for: 'Podjetja ki hočejo maksimalne rezultate',
                features: ['Vse iz Growth', 'Glasovni asistent 24/7', 'Glasovni klici starim strankam', 'Dedicirani telefon (SI ali HR)', 'Prioritetna podpora'],
                missing: [],
              },
            ].map((pkg) => (
              <div key={pkg.name} style={{
                background: 'white', borderRadius: '14px', padding: '28px',
                border: pkg.name === 'GROWTH' ? `2px solid ${cobalt}` : '1px solid #e2e8f0',
                boxShadow: pkg.name === 'GROWTH' ? '0 4px 20px rgba(38,92,255,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
                transform: pkg.name === 'GROWTH' ? 'scale(1.02)' : 'none',
                position: 'relative',
              }}>
                {pkg.badge && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: cobalt, color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                    {pkg.badge}
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>{pkg.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: navy }}>{pkg.price} €</span>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>{pkg.period}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>{pkg.for}</p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  {pkg.features.map(f => <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#374151' }}><span style={{ color: '#16a34a' }}>✓</span>{f}</div>)}
                  {pkg.missing.map(f => <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#94a3b8' }}><span>✗</span>{f}</div>)}
                </div>
                <button
                  onClick={() => { const w = document.querySelector('[data-vera-open]') as HTMLButtonElement; w?.click() }}
                  style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '8px', border: 'none', background: pkg.name === 'GROWTH' ? cobalt : navy, color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  Začni s {pkg.name.charAt(0) + pkg.name.slice(1).toLowerCase()}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#16a34a', fontWeight: 600, marginTop: '32px' }}>
            ✓ Garancija: 10 reaktiviranih strank v 60 dneh ali podaljšamo brezplačno dokler ne dosežemo cilja.
          </p>
        </div>
      </section>

      {/* PRIMERJAVA */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: navy, marginBottom: '8px' }}>Zakaj ne kar obstoječa orodja?</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '36px', fontSize: '15px' }}>Primerjava s tipičnimi rešitvami na trgu</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['', 'Tipični ponudniki', 'Cenejše rešitve', 'Carbonis'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: i === 0 ? 'left' : 'center', fontWeight: 700, color: i === 3 ? cobalt : navy, borderBottom: '2px solid #e2e8f0', background: i === 3 ? '#EEF2FF' : 'transparent' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Mesečna cena', '150–300 €', '50–100 €', '149–349 €'],
                  ['Reaktivacija strank', '✗', '✗', '✓'],
                  ['GEO / AI vidljivost', '✗', '✗', '✓'],
                  ['Booking sistem', 'Delno', '✗', '✓ lastni'],
                  ['Voice klici', '✓ inbound', '✗', '✓ in + out (Pro)'],
                  ['Slovenščina', 'Delno', '✗', '✓'],
                  ['Hrvaščina', '✗', '✗', '✓'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '12px 16px', textAlign: j === 0 ? 'left' : 'center', background: j === 3 ? '#f0f4ff' : 'transparent', color: cell === '✓' ? '#16a34a' : cell === '✗' ? '#dc2626' : '#374151', fontWeight: cell === '✓' || cell === '✗' ? 700 : j === 3 ? 600 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
            Edini sistem v slovenščini ki kombinira reaktivacijo, GEO vidljivost in booking v enem paketu.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: navy, marginBottom: '40px' }}>Pogosta vprašanja</h2>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '10px', marginBottom: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontWeight: 600, fontSize: '15px', color: navy }}>{item.q}</span>
                <span style={{ color: cobalt, fontSize: '20px', marginLeft: '12px', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ background: navy, padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
            Pripravljeni videti koliko strank imate v "spečem" stanju?
          </h2>
          <p style={{ color: '#bfdbfe', fontSize: '16px', marginBottom: '32px' }}>Brezplačen pregled vaše situacije. Brez obveznosti.</p>
          <button
            onClick={() => { const w = document.querySelector('[data-vera-open]') as HTMLButtonElement; w?.click() }}
            style={{ background: cobalt, color: 'white', fontWeight: 700, fontSize: '16px', padding: '15px 40px', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(38,92,255,0.4)' }}
          >
            Preverite zdaj →
          </button>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '16px' }}>Brez kreditne kartice · Podatki ostanejo v EU · Garancija rezultatov</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1a47', padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>Carbonis</span>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>© 2026 Carbonis</p>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase' }}>Platforma</p>
              {['Kako deluje', 'Paketi', 'Primerjava', 'FAQ'].map(l => <p key={l} style={{ marginBottom: '6px' }}><a href={`#${l.toLowerCase().replace(' ', '-')}`} style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase' }}>Kontakt</p>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>info@carbonis.eu</p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>carbonis.eu</p>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '900px', margin: '20px auto 0', borderTop: '1px solid #1e3a6e', paddingTop: '16px' }}>
          <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center' }}>Vsi podatki streženi v EU · GDPR skladno</p>
        </div>
      </footer>
    </div>
  )
}
