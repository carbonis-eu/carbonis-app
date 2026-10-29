import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politika zasebnosti',
  description: 'Politika zasebnosti Carbonis — kako varujemo vaše osebne podatke.',
}

export default function PolitikaZasebnostiPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', color: '#0f172a', lineHeight: '1.7' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: '#0B2471' }}>Politika zasebnosti</h1>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '40px' }}>Zadnja posodobitev: 30. oktober 2026</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>1. Upravljavec podatkov</h2>
        <p>Upravljavec osebnih podatkov je:</p>
        <p style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', fontSize: '14px' }}>
          <strong>Carbonis</strong><br />
          E-pošta: <a href="mailto:info@carbonis.eu" style={{ color: '#265CFF' }}>info@carbonis.eu</a><br />
          Spletna stran: <a href="https://carbonis.eu" style={{ color: '#265CFF' }}>carbonis.eu</a>
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>2. Namen obdelave</h2>
        <p>Vaše osebne podatke obdelujemo izključno za:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>pošiljanje personalizirane ponudbe na vaš e-poštni naslov,</li>
          <li>obveščanje o storitvah Carbonis, za katere ste zaprosili,</li>
          <li>vzpostavitev poslovnega stika na vašo pobudo.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>3. Pravna podlaga</h2>
        <p>Obdelava temelji na <strong>vaši privolitvi</strong> (člen 6(1)(a) GDPR), ki jo podate prostovoljno pred oddajo poizvedbe prek chatbota Vera. Privolitev lahko kadar koli prekličete z zahtevo na <a href="mailto:info@carbonis.eu" style={{ color: '#265CFF' }}>info@carbonis.eu</a>.</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>4. Zbrani podatki</h2>
        <p>Zbiramo naslednje kategorije podatkov:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Ime in priimek ali ime kontaktne osebe</li>
          <li>Ime podjetja</li>
          <li>E-poštni naslov</li>
          <li>Panoga in ocena velikosti baze kontaktov</li>
          <li>Vsebina pogovora z virtualnim asistentom Vera</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>5. Čas hrambe</h2>
        <p>Vaše podatke hranimo <strong>2 leti</strong> od dneva privolitve ali do preklica privolitve, kar nastopi prej. Po preteku tega roka podatke trajno izbrišemo.</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>6. Posredovanje podatkov tretjim osebam</h2>
        <p>Vaših osebnih podatkov <strong>ne posredujemo tretjim osebam</strong> v komercialne namene. Za pošiljanje e-pošte uporabljamo zunanjega ponudnika e-poštnih storitev (Brevo/Sendinblue), ki deluje kot obdelovalec podatkov v skladu z GDPR in podatke obdeluje izključno po naših navodilih.</p>
        <p>Vsi podatki se hranijo in obdelujejo <strong>v okviru EU/EGP</strong>.</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>7. Vaše pravice</h2>
        <p>Skladno z GDPR imate naslednje pravice:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Pravica do vpogleda</strong> — vpogled v podatke, ki jih obdelujemo o vas</li>
          <li><strong>Pravica do popravka</strong> — popravek netočnih podatkov</li>
          <li><strong>Pravica do izbrisa</strong> — brisanje podatkov ("pravica biti pozabljen")</li>
          <li><strong>Pravica do prenosljivosti</strong> — prejemanje podatkov v strukturirani, strojno berljivi obliki</li>
          <li><strong>Pravica do ugovora</strong> — ugovor zoper obdelavo</li>
          <li><strong>Pravica do omejitve</strong> — omejitev obdelave</li>
        </ul>
        <p>Zahtevo uveljavljate pisno na: <a href="mailto:info@carbonis.eu" style={{ color: '#265CFF' }}>info@carbonis.eu</a>. Na vašo zahtevo odgovorimo v 30 dneh.</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>8. Varnost podatkov</h2>
        <p>Podatke varujemo z ustreznimi tehničnimi in organizacijskimi ukrepi, vključno s šifriranjem prenosa (TLS/HTTPS), nadzorom dostopa in varnim shranjevanjem v podatkovnih centrih znotraj EU.</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>9. Pritožba nadzornemu organu</h2>
        <p>Pravico imate vložiti pritožbo pri pristojnem nadzornem organu. V Sloveniji je to <strong>Informacijski pooblaščenec</strong> (<a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" style={{ color: '#265CFF' }}>ip-rs.si</a>).</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0B2471' }}>10. Chatbot Vera — EU AI Act</h2>
        <p>Naš virtualni asistent Vera je avtomatiziran sistem. Skladno s <strong>členom 50 Uredbe EU o umetni inteligenci (EU AI Act)</strong> vas obvestimo, da komunicirate z AI sistemom in ne z živim človekom. Podatki, ki jih delite v pogovoru, se obdelujejo kot opisano v tej politiki.</p>
      </section>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
        Za vprašanja v zvezi z zasebnostjo nas kontaktirajte na <a href="mailto:info@carbonis.eu" style={{ color: '#265CFF' }}>info@carbonis.eu</a>.
      </div>
    </main>
  )
}
