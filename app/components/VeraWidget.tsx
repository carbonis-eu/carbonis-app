'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'vera' | 'user'
  content: string
}

type Step =
  | 'intro'
  | 'industry'
  | 'contacts'
  | 'roi'
  | 'decision'
  | 'get_name'
  | 'get_company'
  | 'get_email'
  | 'gdpr'
  | 'sending'
  | 'done'
  | 'question'

const INDUSTRIES = [
  { label: '🔧 Avtoservis', key: 'avtoservis' },
  { label: '💅 Kozmetika & saloni', key: 'kozmetika' },
  { label: '💪 Fitnes', key: 'fitnes' },
  { label: '🍽️ Gostinstvo', key: 'gostinstvo' },
  { label: '🏠 Nepremičnine', key: 'nepremicnine' },
  { label: '🏥 Ordinacija', key: 'ordinacije' },
  { label: '⚙️ Drugo', key: 'drugo' },
]

const INDUSTRY_RESPONSE: Record<string, string> = {
  avtoservis: 'Avtoservisi imajo tipično 20–30% strank ki se niso vrnile v 12 mesecih.',
  kozmetika: 'Kozmetični saloni imajo povprečno 35% strank, ki so obiskale enkrat in se niso vrnile.',
  fitnes: 'Fitnes klubi izgubijo do 40% članov letno — reaktivacija stare baze je najtežje vprašanje.',
  gostinstvo: 'Gostinci imajo velik potencial za ponovne obiske — povprečna stranka je bila pri vas 3× na leto.',
  nepremicnine: 'Nepremičninski agenti imajo stranke za življenje — reaktivacija in priporočila so zlata vredna.',
  ordinacije: 'Ordinacije imajo visoko vrednost stranke — pacienti, ki se ne vrnejo, pomenijo 1.000+ € izgubljenega prihodka.',
  drugo: 'Vsako podjetje ima stranke, ki so bile zadovoljne, a se niso vrnile. Naš sistem jih reaktivira.',
}

const ROI_TABLE: Record<string, Record<string, number>> = {
  avtoservis:    { 'Do 100': 3750,  '100–300': 7500,  '300–500': 12500, '500+': 18750 },
  kozmetika:     { 'Do 100': 900,   '100–300': 2700,  '300–500': 4500,  '500+': 7500  },
  fitnes:        { 'Do 100': 675,   '100–300': 1147,  '300–500': 2295,  '500+': 3825  },
  gostinstvo:    { 'Do 100': 525,   '100–300': 2100,  '300–500': 3500,  '500+': 7000  },
  nepremicnine:  { 'Do 100': 15000, '100–300': 30000, '300–500': 45000, '500+': 75000 },
  ordinacije:    { 'Do 100': 1200,  '100–300': 4800,  '300–500': 8000,  '500+': 14400 },
}

const PACKAGE_TABLE: Record<string, { name: string; price: number }> = {
  'Do 100':  { name: 'Starter', price: 149 },
  '100–300': { name: 'Growth',  price: 249 },
  '300–500': { name: 'Pro',     price: 349 },
  '500+':    { name: 'Pro',     price: 349 },
}

const CONTACTS_OPTIONS = ['Do 100', '100–300', '300–500', '500+']

function VeraBubble({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '16px 16px 16px 4px',
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#0f172a',
        maxWidth: '85%',
      }}
        dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
      />
    </div>
  )
}

function UserBubble({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
      <div style={{
        background: '#265CFF',
        borderRadius: '16px 16px 4px 16px',
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: 'white',
        maxWidth: '85%',
      }}>
        {content}
      </div>
    </div>
  )
}

function QuickReply({ options, onSelect }: { options: string[]; onSelect: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 0 12px' }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          style={{
            padding: '7px 14px',
            borderRadius: '20px',
            border: '1.5px solid #265CFF',
            background: 'white',
            color: '#265CFF',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#265CFF'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'white'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#265CFF'
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function VeraWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('intro')
  const [messages, setMessages] = useState<Message[]>([])
  const [industry, setIndustry] = useState('')
  const [industryLabel, setIndustryLabel] = useState('')
  const [contactsRange, setContactsRange] = useState('')
  const [contactName, setContactName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, step])

  function addVera(content: string) {
    setMessages(prev => [...prev, { role: 'vera', content }])
  }

  function addUser(content: string) {
    setMessages(prev => [...prev, { role: 'user', content }])
  }

  function handleOpen() {
    setOpen(true)
    if (!started) {
      setStarted(true)
      // 3 messages with delay
      setTimeout(() => addVera('Pozdravljeni 👋'), 300)
      setTimeout(() => addVera('Sem Vera, pomočnica Carbonis — odgovarjam samodejno.'), 900)
      setTimeout(() => {
        addVera('Katera panoga je vaša primarna dejavnost?')
        setStep('industry')
      }, 1600)
    }
  }

  function handleIndustry(label: string) {
    const found = INDUSTRIES.find(i => i.label === label)
    const key = found?.key ?? 'drugo'
    setIndustry(key)
    setIndustryLabel(label)
    addUser(label)

    const response = INDUSTRY_RESPONSE[key]
    setTimeout(() => addVera(response), 400)
    setTimeout(() => {
      addVera('Koliko aktivnih strank/kontaktov imate v bazi?')
      setStep('contacts')
    }, 900)
  }

  function handleContacts(range: string) {
    setContactsRange(range)
    addUser(range)

    if (industry === 'drugo' || !ROI_TABLE[industry]) {
      setTimeout(() => {
        addVera('Hvala! Za panogo "Drugo" vam pripravimo individualno ponudbo.')
        addVera('Pošljite nam vaše podatke in stopili bomo v stik z vami.')
        setStep('get_name')
      }, 400)
      return
    }

    const roi = ROI_TABLE[industry][range] ?? 0
    const pkg = PACKAGE_TABLE[range]
    setTimeout(() => {
      addVera(
        `Na podlagi vaše baze ocenjujem potencial na **${roi.toLocaleString('sl-SI')}€/mes** z ${pkg.name} paketom (${pkg.price}€/mes).`
      )
      setStep('decision')
    }, 500)
  }

  function handleDecision(choice: string) {
    addUser(choice)
    if (choice === 'Imam vprašanje') {
      setTimeout(() => {
        addVera('Seveda! Napišite vaše vprašanje in odgovorili vam bomo v najkrajšem možnem času.')
        setStep('question')
      }, 400)
    } else {
      setTimeout(() => {
        addVera('Da vam pošljem ponudbo, kako vam je ime?')
        setStep('get_name')
      }, 400)
    }
  }

  function handleQuestion() {
    if (!inputValue.trim()) return
    addUser(inputValue)
    setInputValue('')
    setTimeout(() => {
      addVera('Hvala za vprašanje! Ekipa Carbonis vam bo odgovorila na info@carbonis.eu v 24 urah.')
    }, 400)
  }

  function handleName() {
    const name = inputValue.trim()
    if (!name) return
    setContactName(name)
    addUser(name)
    setInputValue('')
    setTimeout(() => {
      addVera(`Hvala, ${name}! Ime vašega podjetja?`)
      setStep('get_company')
    }, 400)
  }

  function handleCompany() {
    const company = inputValue.trim()
    if (!company) return
    setCompanyName(company)
    addUser(company)
    setInputValue('')
    setTimeout(() => {
      addVera(`Na kateri email vam pošljem ponudbo za ${company}?`)
      setStep('get_email')
    }, 400)
  }

  function handleEmail() {
    const mail = inputValue.trim()
    if (!mail || !mail.includes('@')) return
    setEmail(mail)
    addUser(mail)
    setInputValue('')
    setTimeout(() => {
      setStep('gdpr')
    }, 400)
  }

  async function handleGdprSubmit() {
    if (!gdprConsent) return
    setSending(true)
    setStep('sending')
    addVera(`Hvala, ${contactName}! 🎉 Pripravljam personalizirano ponudbo za ${companyName}...`)

    const roi = industry !== 'drugo' && ROI_TABLE[industry] ? ROI_TABLE[industry][contactsRange] : undefined
    const pkg = PACKAGE_TABLE[contactsRange]

    try {
      const res = await fetch('/api/vera/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: contactName,
          company_name: companyName,
          email,
          industry,
          estimated_contacts: contactsRange,
          recommended_package: pkg?.name ?? 'individualno',
          estimated_roi_eur: roi ?? null,
          gdpr_consent: true,
          conversation_log: messages,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        addVera(`Ponudba je na poti! Preverite email ${email}. Se vidimo kmalu! 👋`)
      } else {
        addVera('Prišlo je do napake. Prosim kontaktirajte nas na info@carbonis.eu.')
      }
    } catch {
      addVera('Prišlo je do napake. Prosim kontaktirajte nas na info@carbonis.eu.')
    }
    setSending(false)
    setStep('done')
  }

  const roi = industry && contactsRange && ROI_TABLE[industry] ? ROI_TABLE[industry][contactsRange] : undefined
  const pkg = contactsRange ? PACKAGE_TABLE[contactsRange] : undefined

  return (
    <>
      {/* Bubble button */}
      <button
        data-vera-open="true"
        onClick={handleOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#0B2471',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px 12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(11,36,113,0.35)',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 10.5C17 14.09 13.87 17 10 17C8.85 17 7.76 16.72 6.82 16.22L3 17L3.78 13.18C3.28 12.24 3 11.15 3 10C3 6.13 6.13 3 10 3C13.87 3 17 6.13 17 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Vprašajte Vero</span>
        {/* Pulsing green dot */}
        <span style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
          <span style={{
            position: 'absolute', inset: 0,
            background: '#22c55e', borderRadius: '50%',
            animation: 'vera-pulse 1.5s ease-out infinite',
          }} />
          <span style={{
            position: 'absolute', inset: '2px',
            background: '#22c55e', borderRadius: '50%',
          }} />
        </span>
        <style>{`@keyframes vera-pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.5);opacity:0}}`}</style>
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          zIndex: 9998,
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '80vh',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(11,36,113,0.22)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: '#0B2471',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #265CFF, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0,
            }}>V</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '15px', margin: 0 }}>Vera</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>Pomočnica Carbonis</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px', fontSize: '20px', lineHeight: 1 }}
            >×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
            {messages.map((m, i) =>
              m.role === 'vera'
                ? <VeraBubble key={i} content={m.content} />
                : <UserBubble key={i} content={m.content} />
            )}

            {/* Quick replies / inputs for current step */}
            {step === 'industry' && (
              <QuickReply
                options={INDUSTRIES.map(i => i.label)}
                onSelect={handleIndustry}
              />
            )}

            {step === 'contacts' && (
              <QuickReply options={CONTACTS_OPTIONS} onSelect={handleContacts} />
            )}

            {step === 'decision' && (
              <QuickReply
                options={['Pošljite mi ponudbo ✓', 'Imam vprašanje']}
                onSelect={handleDecision}
              />
            )}

            {step === 'gdpr' && (
              <div style={{ margin: '8px 0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={e => setGdprConsent(e.target.checked)}
                    style={{ marginTop: '2px', accentColor: '#265CFF', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <span>
                    Strinjam se z obdelavo osebnih podatkov za namen pošiljanja ponudbe.{' '}
                    <a href="/politika-zasebnosti" target="_blank" style={{ color: '#265CFF', textDecoration: 'underline' }}>Politika zasebnosti →</a>
                    <br />
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>Podatke hranimo varno v EU in jih ne posredujemo tretjim osebam.</span>
                  </span>
                </label>
                <button
                  onClick={handleGdprSubmit}
                  disabled={!gdprConsent || sending}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '10px',
                    background: gdprConsent ? '#265CFF' : '#94a3b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: gdprConsent && !sending ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s',
                  }}
                >
                  {sending ? 'Pošiljam...' : 'Pošlji ponudbo'}
                </button>
              </div>
            )}

            {/* Text input steps */}
            {(step === 'get_name' || step === 'get_company' || step === 'get_email' || step === 'question') && (
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0 4px' }}>
                <input
                  type={step === 'get_email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (step === 'get_name') handleName()
                      else if (step === 'get_company') handleCompany()
                      else if (step === 'get_email') handleEmail()
                      else if (step === 'question') handleQuestion()
                    }
                  }}
                  placeholder={
                    step === 'get_name' ? 'Vaše ime...' :
                    step === 'get_company' ? 'Ime podjetja...' :
                    step === 'get_email' ? 'Email naslov...' :
                    'Vaše vprašanje...'
                  }
                  autoFocus
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none',
                    color: '#0f172a',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#265CFF')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button
                  onClick={() => {
                    if (step === 'get_name') handleName()
                    else if (step === 'get_company') handleCompany()
                    else if (step === 'get_email') handleEmail()
                    else if (step === 'question') handleQuestion()
                  }}
                  style={{
                    padding: '10px 14px', background: '#265CFF', color: 'white',
                    border: 'none', borderRadius: '10px', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div style={{
            padding: '8px 16px 12px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#94a3b8',
            borderTop: '1px solid #f1f5f9',
            flexShrink: 0,
          }}>
            Pogovarjate se z AI asistentom — skladno z EU AI Act čl. 50.
          </div>
        </div>
      )}
    </>
  )
}
