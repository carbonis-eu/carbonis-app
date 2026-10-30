'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const cobalt = '#1E7A56'
const navy = '#102A56'

const VeraAvatar = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="18" fill="url(#veraGrad)"/>
    <defs>
      <linearGradient id="veraGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#26966B"/>
        <stop offset="100%" stopColor="#1E7A56"/>
      </linearGradient>
    </defs>
    <ellipse cx="18" cy="8" rx="5" ry="4" fill="#4A3728"/>
    <circle cx="18" cy="5.5" rx="3" ry="3" fill="#4A3728"/>
    <circle cx="15.5" cy="7" rx="1.5" ry="1.5" fill="#4A3728"/>
    <circle cx="20.5" cy="7" rx="1.5" ry="1.5" fill="#4A3728"/>
    <line x1="16" y1="5" x2="20" y2="5" stroke="#E8C87A" strokeWidth="1" strokeLinecap="round"/>
    <ellipse cx="18" cy="17" rx="6.5" ry="7" fill="#F5C9A0"/>
    <ellipse cx="11.8" cy="16" rx="2" ry="5" fill="#4A3728"/>
    <ellipse cx="24.2" cy="16" rx="2" ry="5" fill="#4A3728"/>
    <rect x="11.5" y="15" width="5" height="3.5" rx="1.5" fill="none" stroke="#2D2D2D" strokeWidth="1.2"/>
    <rect x="19.5" y="15" width="5" height="3.5" rx="1.5" fill="none" stroke="#2D2D2D" strokeWidth="1.2"/>
    <line x1="16.5" y1="16.7" x2="19.5" y2="16.7" stroke="#2D2D2D" strokeWidth="1.2"/>
    <line x1="11" y1="16.7" x2="11.5" y2="16.7" stroke="#2D2D2D" strokeWidth="1.2"/>
    <line x1="24.5" y1="16.7" x2="25" y2="16.7" stroke="#2D2D2D" strokeWidth="1.2"/>
    <circle cx="14" cy="16.7" r="1" fill="#3D2B1F"/>
    <circle cx="22" cy="16.7" r="1" fill="#3D2B1F"/>
    <path d="M15.5 21 Q18 23 20.5 21" stroke="#C4876A" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M8 36 Q10 28 14 26 L18 28 L22 26 Q26 28 28 36Z" fill="#1E5A8A"/>
    <path d="M16 26 L18 30 L20 26" fill="#FFFFFF" opacity="0.3"/>
  </svg>
)

// ─── Panoge ───────────────────────────────────────────────────────────────────

const PANOGE = [
  'Avtoservis', 'Kozmetika / salon', 'Fitnes studio', 'Gostinstvo',
  'Nepremičnine', 'Ordinacija', 'Vulkanizerji', 'Serviserji & monterji',
]

const CONTACTS_OPTIONS = ['Do 100 strank', '100–300 strank', '300–500 strank', '500+ strank']

const PANOGA_RESPONSES: Record<string, string> = {
  'Avtoservis': 'Avtoservisi imajo odličen potencial za reaktivacijo strank! 🚗\n\nKoliko aktivnih strank imate v svoji bazi?',
  'Kozmetika / salon': 'Kozmetični saloni so ena naših najuspešnejših panog — reaktivacija deluje izjemno dobro! 💅\n\nKoliko aktivnih strank imate v svoji bazi?',
  'Fitnes studio': 'Fitnes studii imajo pogosto stranke, ki so prenehale prihajati — z avtomatizacijo jih uspešno vrnemo. 🏋️\n\nKoliko aktivnih članov imate v svoji bazi?',
  'Gostinstvo': 'V gostinstvu je pogostost obiskov ključna — avtomatska sporočila stranke učinkovito spomnijo. 🍽️\n\nKoliko aktivnih gostov imate v svoji bazi?',
  'Nepremičnine': 'V nepremičninah je dolgoročno grajenje zaupanja ključno — Carbonis pomaga ostati v stiku. 🏠\n\nKoliko aktivnih kontaktov imate v svoji bazi?',
  'Ordinacija': 'Zdravstvene ordinacije imajo redne preventivne preglede — avtomatski opomniki bistveno povečajo udeležbo. 🏥\n\nKoliko pacientov imate v svoji bazi?',
  'Vulkanizerji': 'Vulkanizerji imajo sezonske stranke — spomin pred sezono je zlata vredna! 🔧\n\nKoliko aktivnih strank imate v svoji bazi?',
  'Serviserji & monterji': 'Servisna podjetja imajo stranke, ki jih pozabijo poklicati — reaktivacija to sistemsko reši. ⚙️\n\nKoliko aktivnih strank imate v svoji bazi?',
}

// ─── ROI kalkulacija (frontend) ───────────────────────────────────────────────

const ROI_RATES: Record<string, { rate: number; value: number }> = {
  'Avtoservis': { rate: 0.15, value: 250 },
  'Kozmetika / salon': { rate: 0.25, value: 60 },
  'Fitnes studio': { rate: 0.20, value: 50 },
  'Gostinstvo': { rate: 0.30, value: 40 },
  'Nepremičnine': { rate: 0.10, value: 2000 },
  'Ordinacija': { rate: 0.20, value: 80 },
  'Vulkanizerji': { rate: 0.60, value: 10 },
  'Serviserji & monterji': { rate: 0.40, value: 120 },
}

function contactsToNumber(label: string): number {
  if (label.includes('100–300')) return 200
  if (label.includes('300–500')) return 400
  if (label.includes('500+')) return 600
  return 80
}

function calcROI(panoga: string, n: number) {
  const r = ROI_RATES[panoga] ?? { rate: 0.15, value: 100 }
  const roi = Math.round(n * r.rate * r.value)
  const pkg = n <= 100 ? 'Starter' : n <= 300 ? 'Growth' : 'Pro'
  const price = n <= 100 ? 149 : n <= 300 ? 249 : 349
  return { roi, pkg, price }
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

// ─── Types ────────────────────────────────────────────────────────────────────

type FunnelStep = 'panoga' | 'contacts' | 'sales' | 'gdpr' | 'done'
type SalesField = 'gender' | 'name' | 'company' | 'email'

interface FunnelData {
  panoga: string | null
  contacts: string | null
  roi: number | null
  pkg: string | null
  price: number | null
  gender: string | null  // 'g.' | 'ga.'
  name: string | null
  company: string | null
  email: string | null
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

// ─── API calls ────────────────────────────────────────────────────────────────

async function callVeraAI(
  messages: Message[],
  salesContext: {
    panoga: string; contacts: string; roi: number; pkg: string; price: number
    gender?: string
    collected: { name?: string; company?: string }
    collecting: SalesField
  }
): Promise<string> {
  const res = await fetch('/api/vera/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      salesContext,
    }),
  })
  const data = await res.json() as { text?: string; error?: string }
  if (!res.ok || data.error) throw new Error(data.error ?? 'Napaka')
  return data.text ?? ''
}

async function saveLead(data: FunnelData, conversation: Message[]): Promise<string | null> {
  try {
    const res = await fetch('/api/vera/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_name: data.name,
        company_name: data.company,
        email: data.email,
        industry: data.panoga,
        estimated_contacts: data.contacts,
        recommended_package: data.pkg,
        estimated_roi_eur: data.roi,
        gdpr_consent: true,
        conversation_log: conversation.map(m => ({ role: m.role, content: m.content })),
      }),
    })
    const json = await res.json() as { ok: boolean; lead_id?: string }
    return json.lead_id ?? null
  } catch { return null }
}

function analyzeConversation(conversation: Message[], panoga: string, contacts: string, leadId: string | null) {
  fetch('/api/vera/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_log: conversation.map(m => ({ role: m.role, content: m.content })),
      industry: panoga, contacts_estimate: contacts, lead_id: leadId,
    }),
  }).catch(() => {})
}

// ─── Component ────────────────────────────────────────────────────────────────

const TEASER_MSGS = ['Pozdravljeni! 👋', 'Sem Vera, AI pomočnica Carbonis.', 'Koliko strank spi v vaši bazi?']

export default function VeraWidget() {
  const [open, setOpen] = useState(false)
  const [teaserVisible, setTeaserVisible] = useState(false)
  const [teaserDismissed, setTeaserDismissed] = useState(false)
  const [teaserStep, setTeaserStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [funnelStep, setFunnelStep] = useState<FunnelStep>('panoga')
  const [collecting, setCollecting] = useState<SalesField>('name')
  const [funnel, setFunnel] = useState<FunnelData>({
    panoga: null, contacts: null, roi: null, pkg: null, price: null,
    gender: null, name: null, company: null, email: null,
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const leadSavedRef = useRef(false)
  const funnelRef = useRef(funnel)
  funnelRef.current = funnel

  useEffect(() => {
    const t = setTimeout(() => { if (!teaserDismissed && !open) setTeaserVisible(true) }, 2500)
    return () => clearTimeout(t)
  }, [teaserDismissed, open])

  useEffect(() => {
    if (!teaserVisible || teaserStep >= TEASER_MSGS.length - 1) return
    const t = setTimeout(() => setTeaserStep(s => s + 1), 700)
    return () => clearTimeout(t)
  }, [teaserVisible, teaserStep])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Pozdravljeni! Sem Vera, AI pomočnica Carbonis. 🤝\n\nKakšna je vaša panoga?' }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, messages.length])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const openChat = () => { setOpen(true); setTeaserVisible(false); setTeaserDismissed(true) }

  // Korak 1: stranka izbere panogo
  const handlePanoga = useCallback((panoga: string) => {
    const reply = PANOGA_RESPONSES[panoga] ?? `${panoga} — odlična panoga!\n\nKoliko aktivnih strank imate v svoji bazi?`
    setFunnel(f => ({ ...f, panoga }))
    setFunnelStep('contacts')
    setMessages(prev => [...prev,
      { role: 'user', content: panoga },
      { role: 'assistant', content: reply },
    ])
  }, [])

  // Korak 2: stranka izbere število strank → ROI kalkulacija
  const handleContacts = useCallback((contactsLabel: string) => {
    const f = funnelRef.current
    if (!f.panoga) return
    const n = contactsToNumber(contactsLabel)
    const { roi, pkg, price } = calcROI(f.panoga, n)
    setFunnel(prev => ({ ...prev, contacts: contactsLabel, roi, pkg, price }))
    setFunnelStep('sales')
    setCollecting('gender')
    const roiMsg = `Na podlagi ${contactsLabel} v panogi **${f.panoga}** ocenjujem potencial reaktivacije na circa **${roi.toLocaleString('sl-SI')} €/mesec** *(ocena, ne zagotovilo)*.\n\nPriporočam paket **${pkg}** za **${price} €/mesec**.\n\nPreden nadaljujemo — kako naj vas naslavljam?`
    setMessages(prev => [...prev,
      { role: 'user', content: contactsLabel },
      { role: 'assistant', content: roiMsg },
    ])
  }, [])

  // Korak 2b: spol (g./ga.)
  const handleGender = useCallback((genderLabel: string) => {
    const prefix = genderLabel === 'Gospod' ? 'g.' : 'ga.'
    setFunnel(f => ({ ...f, gender: prefix }))
    setCollecting('name')
    setMessages(prev => [...prev,
      { role: 'user', content: genderLabel },
      { role: 'assistant', content: `Odlično! Ali mi lahko zaupate vaše polno ime in priimek?` },
    ])
  }, [])

  // Korak 4: GDPR
  const handleGDPR = useCallback(async (accepted: boolean) => {
    const f = funnelRef.current
    const answer = accepted ? 'Da, strinjam se.' : 'Ne, hvala.'
    if (!accepted) {
      setMessages(prev => [...prev,
        { role: 'user', content: answer },
        { role: 'assistant', content: 'Razumem. Vaši podatki ne bodo shranjeni. Če se kdaj premislite, smo dosegljivi na info@carbonis.eu. 😊' },
      ])
      setFunnelStep('done')
      return
    }
    const addressedName = f.gender ? `${f.gender} ${f.name}` : f.name
    const thankMsg = `Hvala, ${addressedName}! Analiza za **${f.company}** je na poti na ${f.email}. Javili se vam bomo kmalu. 🙏`
    setMessages(prev => [...prev,
      { role: 'user', content: answer },
      { role: 'assistant', content: thankMsg },
    ])
    setFunnelStep('done')
    if (!leadSavedRef.current) {
      leadSavedRef.current = true
      setMessages(prev => {
        const allMsgs = [...prev]
        saveLead(f, allMsgs).then(leadId => {
          analyzeConversation(allMsgs, f.panoga!, f.contacts!, leadId)
        })
        return prev
      })
    }
  }, [])

  // Korak 3: prodajni pogovor (ime → podjetje → email)
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const f = funnelRef.current
    let newFunnel = { ...f }

    // Validacija
    if (collecting === 'email' && !isEmail(trimmed)) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ta email naslov ne izgleda pravilen. Prosim vnesite veljavni email (npr. ime@podjetje.si).',
      }])
      setLoading(false)
      return
    }

    if (collecting === 'name') {
      const letters = trimmed.replace(/[^a-zA-ZčšžČŠŽ\s]/g, '').trim()
      if (letters.length < 2 || trimmed.length > 60) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Prosim vnesite vaše pravo ime in priimek (npr. Jana Novak).',
        }])
        setLoading(false)
        return
      }
    }

    // Shrani polje
    if (collecting === 'name') newFunnel.name = trimmed
    else if (collecting === 'company') newFunnel.company = trimmed
    else if (collecting === 'email') newFunnel.email = trimmed
    setFunnel(newFunnel)

    // Email zbran → GDPR (brez AI klica)
    if (collecting === 'email') {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Odlično! Za pošiljanje individualne analize za **${newFunnel.company}** potrebujem vaše soglasje za obdelavo osebnih podatkov v skladu z GDPR. Ali se strinjate?`,
      }])
      setFunnelStep('gdpr')
      setLoading(false)
      return
    }

    // Naslednje polje
    const nextField: SalesField = collecting === 'name' ? 'company' : 'email'
    setCollecting(nextField)

    // AI generira naraven odziv za naslednje vprašanje
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])
    try {
      const allMsgs = [...messages, userMsg]
      const responseText = await callVeraAI(allMsgs, {
        panoga: newFunnel.panoga!,
        contacts: newFunnel.contacts!,
        roi: newFunnel.roi!,
        pkg: newFunnel.pkg!,
        price: newFunnel.price!,
        gender: newFunnel.gender ?? undefined,
        collected: {
          name: newFunnel.name ?? undefined,
          company: newFunnel.company ?? undefined,
        },
        collecting: nextField,
      })
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: responseText }
        return copy
      })
    } catch {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: 'Ups, prišlo je do napake. Prosim poskusite znova.' }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }, [messages, loading, collecting])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  // Quick reply gumbi glede na korak
  const renderQuickReplies = (lastMsg: Message | undefined, msgIndex: number, totalMsgs: number) => {
    if (msgIndex !== totalMsgs - 1 || loading || !lastMsg || lastMsg.role !== 'assistant') return null

    if (funnelStep === 'panoga') {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', paddingLeft: '4px' }}>
          {PANOGE.map(p => (
            <button key={p} onClick={() => handlePanoga(p)} style={{
              background: 'white', border: '1.5px solid #D1D9E6', borderRadius: '999px',
              padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: navy,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{p}</button>
          ))}
        </div>
      )
    }

    if (funnelStep === 'contacts') {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', paddingLeft: '4px' }}>
          {CONTACTS_OPTIONS.map(c => (
            <button key={c} onClick={() => handleContacts(c)} style={{
              background: 'white', border: '1.5px solid #D1D9E6', borderRadius: '999px',
              padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: navy,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{c}</button>
          ))}
        </div>
      )
    }

    if (funnelStep === 'sales' && collecting === 'gender') {
      return (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingLeft: '4px' }}>
          {['Gospod', 'Gospa'].map(g => (
            <button key={g} onClick={() => handleGender(g)} style={{
              background: 'white', border: '1.5px solid #D1D9E6', borderRadius: '999px',
              padding: '7px 20px', fontSize: '13px', fontWeight: 600, color: navy,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{g}</button>
          ))}
        </div>
      )
    }

    if (funnelStep === 'gdpr') {
      return (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingLeft: '4px' }}>
          <button onClick={() => handleGDPR(true)} style={{
            background: cobalt, color: 'white', border: 'none', borderRadius: '999px',
            padding: '7px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>✓ Da</button>
          <button onClick={() => handleGDPR(false)} style={{
            background: 'white', color: '#64748b', border: '1.5px solid #D1D9E6', borderRadius: '999px',
            padding: '7px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Ne</button>
        </div>
      )
    }

    return null
  }

  const inputDisabled = loading || funnelStep !== 'sales' || collecting === 'gender'
  const inputPlaceholder =
    funnelStep === 'panoga' ? 'Izberite panogo zgoraj...' :
    funnelStep === 'contacts' ? 'Izberite možnost zgoraj...' :
    funnelStep === 'gdpr' ? 'Izberite DA ali NE zgoraj...' :
    funnelStep === 'done' ? 'Pogovor zaključen.' :
    collecting === 'gender' ? 'Izberite Gospod ali Gospa zgoraj...' :
    collecting === 'name' ? 'Vaše ime in priimek...' :
    collecting === 'company' ? 'Naziv podjetja...' :
    'Vaš email naslov...'

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes dotBlink { 0%,80%,100%{opacity:0} 40%{opacity:1} }
      `}</style>

      {/* Teaser */}
      {teaserVisible && !open && (
        <div style={{ position: 'fixed', bottom: '90px', right: '24px', zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', animation: 'fadeInUp 0.3s ease' }}>
          {TEASER_MSGS.slice(0, teaserStep + 1).map((msg, i) => (
            <div key={i} onClick={openChat} style={{ background: 'white', borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: '13.5px', color: navy, boxShadow: '0 4px 20px rgba(0,0,0,0.14)', cursor: 'pointer', maxWidth: '220px', lineHeight: 1.45, fontWeight: 500, animation: 'fadeInUp 0.25s ease' }}>{msg}</div>
          ))}
          <button onClick={e => { e.stopPropagation(); setTeaserVisible(false); setTeaserDismissed(true) }} style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: '#64748b', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      )}

      {/* Floating button */}
      <button data-vera-open onClick={openChat} aria-label="Odpri Vera AI pomočnico" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, #26966B, ${cobalt})`, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(30,122,86,0.45)', display: open ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <VeraAvatar size={44} />
      </button>

      {/* Chat window */}
      {open && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, width: '360px', maxWidth: 'calc(100vw - 32px)', height: '540px', maxHeight: 'calc(100vh - 48px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', background: '#F7F8FA', animation: 'fadeInUp 0.25s ease' }}>

          {/* Header */}
          <div style={{ background: '#1E7A56', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ flexShrink: 0 }}><VeraAvatar size={36} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: 0 }}>Vera</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', margin: 0 }}>
                AI pomočnica Carbonis · {loading ? 'piše...' : 'online'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '20px', cursor: 'pointer', padding: '4px' }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '82%', background: msg.role === 'user' ? cobalt : 'white', color: msg.role === 'user' ? 'white' : '#0f172a', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', padding: '10px 14px', fontSize: '13.5px', lineHeight: 1.55, boxShadow: msg.role === 'assistant' ? '0 1px 4px rgba(0,0,0,0.07)' : 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.streaming && msg.content.length === 0 ? (
                      <span style={{ display: 'inline-flex', gap: '3px', verticalAlign: 'middle' }}>
                        {[0,1,2].map(j => <span key={j} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: `dotBlink 1.2s ease-in-out ${j * 0.2}s infinite` }}/>)}
                      </span>
                    ) : msg.content}
                  </div>
                </div>
                {renderQuickReplies(msg, i, messages.length)}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', background: 'white', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#F7F8FA', borderRadius: '12px', border: '1.5px solid #D1D8E4', padding: '6px 6px 6px 14px' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={inputPlaceholder}
                disabled={inputDisabled}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13.5px', color: inputDisabled ? '#94a3b8' : '#0f172a', outline: 'none', fontFamily: 'var(--font-inter, sans-serif)' }}
              />
              <button onClick={() => sendMessage(input)} disabled={inputDisabled || !input.trim()} style={{ width: '34px', height: '34px', borderRadius: '8px', background: !inputDisabled && input.trim() ? cobalt : '#D1D8E4', border: 'none', cursor: !inputDisabled && input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8L3 3l2 5-2 5 10-5z" fill={!inputDisabled && input.trim() ? 'white' : '#94a3b8'}/></svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '8px 14px', background: 'white', borderTop: '1px solid #f1f5f9', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>AI asistent · EU AI Act · <a href="/politika-zasebnosti" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>Zasebnost</a></p>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}><a href="mailto:info@carbonis.eu" style={{ color: '#94a3b8' }}>info@carbonis.eu</a></p>
          </div>
        </div>
      )}
    </>
  )
}
