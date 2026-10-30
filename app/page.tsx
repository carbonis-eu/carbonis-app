'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const INDUSTRIES = [
  { label: 'Avtoservisi', problem: 'Vsak avto se vrne na servis — samo če dobi opomnik v pravem trenutku.', details: '80% strank ne pride na naslednji servis brez opomnika. Vaša baza stranke miruje in z njo vaš prihodek.', solution: 'Carbonis pošlje osebno sporočilo vsaki stranki po 6 mesecih neaktivnosti. Booking sistem sprejme termin 24/7, tudi ko ste pod avtomobilom.', calcLabel: '200 strank × 15% × 250 €', calcResult: '7.500 €/mes' },
  { label: 'Kozmetika & saloni', problem: 'Redne stranke odidejo, ker se nihče ne spomni nanje ob pravem času.', details: 'Povprečna stranka salona se vrne vsakih 4–6 tednov. Brez opomnika ta cikel prekinejo in odidejo h konkurenci.', solution: 'Sistem sproži sporočilo, ko poteče tipičen interval obiska. Vsak obisk prinese prošnjo za Google oceno.', calcLabel: '150 strank × 20% × 60 €', calcResult: '1.800 €/mes' },
  { label: 'Fitnes studii', problem: 'Neaktivni člani ne odidejo — samo prenehajo prihajati in plačevati.', details: 'Neaktivni člani so vaš največji neuporabljeni prihodek. So že plačali in čakajo, da jih nekdo pokliče nazaj.', solution: 'Carbonis identificira člane brez aktivnosti in sproži reaktivacijsko sekvenco s posebno ponudbo za vrnitev.', calcLabel: '300 strank × 12% × 45 €', calcResult: '1.620 €/mes' },
  { label: 'Gostinci', problem: 'Gosti so zadovoljni — a ne pustijo ocene in ne pridejo nazaj sami od sebe.', details: 'Gostinci z aktivnim zbiranjem ocen dosegajo 4,7+ na Googlu in pridobivajo nova naročila brez oglaševanja.', solution: 'Vsak obisk sproži prošnjo za Google oceno. Reaktivacija za praznike, obletnice in posebne priložnosti.', calcLabel: '500 strank × 10% × 35 €', calcResult: '1.750 €/mes' },
  { label: 'Nepremičnine', problem: 'Stare stranke so vaš najtoplejši vir priporočil — ampak jih pozabljate kontaktirati.', details: 'Večina posrednikov izgubi stik s kupci takoj po zaključku posla. Priporočila in ponovni nakupi ostanejo neizkoriščeni.', solution: 'Carbonis vzdržuje stik z bazo kupcev in prodajalcev. Reaktivacija ob spremembi trga ali obletnicah nakupa.', calcLabel: '50 strank × 8% × 3.500 €', calcResult: '14.000 €/mes' },
  { label: 'Ordinacije', problem: 'Preventivni pregledi se pozabijo — pacienti se ne vrnejo sami brez opomnika.', details: 'Reden kontakt z bazo pacientov poveča zaupanje, zmanjša čakalnico in izboljša zdravstvene izide.', solution: 'Sistem sproži opomnik za letni pregled ali nadaljevanje zdravljenja. Vse skladno z GDPR zakonodajo.', calcLabel: '200 strank × 15% × 80 €', calcResult: '2.400 €/mes' },
]

const FAQS = [
  { q: 'Kaj če nimam urejene baze strank?', a: 'Ni problema. Pošljite kar imate — Excel, seznam, foto papirja. Uredimo za vas brez doplačila.' },
  { q: 'Kako hitro vidim prve rezultate?', a: 'Prve odzive strank tipično vidite v 7–14 dneh od zagona. Odvisno od panoge in velikosti baze.' },
  { q: 'Ali bodo moje stranke vedele da gre za sistem?', a: 'Sporočila so podpisana z imenom vašega podjetja. Stranke vidijo vašo blagovno znamko — Carbonis ostane v ozadju.' },
  { q: 'Kaj če odpovem?', a: 'Starter in Growth: odpoveste kadarkoli brez kazni. Pro: 12-mesečna pogodba z enoletno zavezo.' },
  { q: 'Ali so moji podatki varni?', a: 'Vsi podatki so shranjeni na EU strežnikih in obdelani v skladu z GDPR zakonodajo. Vaše stranke so zaščitene.' },
  { q: 'Kako poteka postavitev?', a: 'Izpolnite kratek vprašalnik (10 min). V 24 urah je sistem pripravljen za vas. Nobenih tehničnih znanj ni potrebno.' },
]

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1E7A56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'1px'}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D1D9E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'1px'}}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function HomePage() {
  const [activeIndustry, setActiveIndustry] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ind = INDUSTRIES[activeIndustry]

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Manrope',var(--font-manrope),Arial,sans-serif;color:#203342;background:#FFFFFF;-webkit-font-smoothing:antialiased}
        a{color:#1E7A56;text-decoration:none}
        button{font-family:'Manrope',var(--font-manrope),Arial,sans-serif;cursor:pointer}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-cta-desktop{display:none!important}
          .nav-hamburger{display:flex!important}
          .hero-grid{grid-template-columns:1fr!important}
          .hero-dashboard-wrap{display:none!important}
          .hero-mobile-dash{display:block!important}
          .process-grid{grid-template-columns:1fr!important;gap:0!important}
          .process-connector{display:none!important}
          .why-grid,.why-grid-rev{grid-template-columns:1fr!important}
          .stat-strip{grid-template-columns:1fr 1fr!important}
          .pricing-grid{grid-template-columns:1fr!important;max-width:420px!important;margin-left:auto!important;margin-right:auto!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
          .dash-main-grid{grid-template-columns:1fr!important}
          .dash-stat-row{grid-template-columns:1fr 1fr!important}
          .industry-content-grid{grid-template-columns:1fr!important}
          .section-pad{padding:64px 0!important}
          .hero-h1{font-size:38px!important}
          .h2-size{font-size:28px!important}
          .faq-grid{grid-template-columns:1fr!important;gap:32px!important}
        }
        @media(max-width:480px){
          .container{padding:0 20px!important}
          .hero-h1{font-size:32px!important}
          .stat-strip{grid-template-columns:1fr 1fr!important}
          .pricing-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important}
          .dash-stat-row{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* 01 NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'#FFFFFF',boxShadow:navScrolled?'0 1px 16px rgba(23,54,77,0.09)':'none',borderBottom:navScrolled?'1px solid #E3EAE8':'1px solid transparent',transition:'box-shadow 200ms,border-color 200ms'}}>
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',height:'68px',gap:'16px'}}>
          <Link href="/" style={{flexShrink:0}}>
            <img src="/carbonis-logo.png" alt="Carbonis" style={{height:'44px',width:'auto'}}/>
          </Link>
          <div className="nav-links" style={{display:'flex',alignItems:'center',gap:'28px',flex:1,justifyContent:'center'}}>
            <a href="#kako-deluje" style={{fontSize:'14px',fontWeight:500,color:'#203342'}}>Kako deluje</a>
            <a href="#panoge" style={{fontSize:'14px',fontWeight:500,color:'#203342'}}>Panoge</a>
            <a href="#paketi" style={{fontSize:'14px',fontWeight:500,color:'#203342'}}>Paketi</a>
            <a href="#faq" style={{fontSize:'14px',fontWeight:500,color:'#203342'}}>FAQ</a>
          </div>
          <div className="nav-cta-desktop" style={{display:'flex',alignItems:'center',gap:'16px',flexShrink:0}}>
            <Link href="/login" style={{fontSize:'14px',fontWeight:500,color:'#687985'}}>Prijava</Link>
            <Link href="/register" style={{background:'#1E7A56',color:'#FFFFFF',borderRadius:'999px',padding:'11px 22px',fontSize:'14px',fontWeight:700,whiteSpace:'nowrap'}}>Začnite brezplačno</Link>
          </div>
          <button className="nav-hamburger" onClick={() => setMobileMenuOpen(v => !v)} style={{display:'none',flexDirection:'column',gap:'5px',background:'none',border:'none',padding:'8px',flexShrink:0}}>
            <span style={{width:'22px',height:'2px',background:'#17364D',display:'block',borderRadius:'2px'}}/>
            <span style={{width:'22px',height:'2px',background:'#17364D',display:'block',borderRadius:'2px'}}/>
            <span style={{width:'22px',height:'2px',background:'#17364D',display:'block',borderRadius:'2px'}}/>
          </button>
        </div>
        {mobileMenuOpen && (
          <div style={{display:'flex',flexDirection:'column',background:'#FFFFFF',borderTop:'1px solid #E3EAE8',padding:'16px 24px 24px'}}>
            <a href="#kako-deluje" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'16px',fontWeight:600,color:'#203342',padding:'14px 0',borderBottom:'1px solid #F5F8F7'}}>Kako deluje</a>
            <a href="#panoge" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'16px',fontWeight:600,color:'#203342',padding:'14px 0',borderBottom:'1px solid #F5F8F7'}}>Panoge</a>
            <a href="#paketi" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'16px',fontWeight:600,color:'#203342',padding:'14px 0',borderBottom:'1px solid #F5F8F7'}}>Paketi</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{fontSize:'16px',fontWeight:600,color:'#203342',padding:'14px 0',borderBottom:'1px solid #F5F8F7'}}>FAQ</a>
            <div style={{display:'flex',flexDirection:'column',gap:'12px',marginTop:'20px'}}>
              <Link href="/login" style={{fontSize:'15px',fontWeight:500,color:'#687985',textAlign:'center'}}>Prijava</Link>
              <Link href="/register" style={{background:'#1E7A56',color:'#FFFFFF',borderRadius:'999px',padding:'14px',fontSize:'15px',fontWeight:700,textAlign:'center'}}>Začnite brezplačno</Link>
            </div>
          </div>
        )}
      </nav>

      {/* 02 HERO */}
      <section style={{background:'#FFFFFF',padding:'80px 0 72px'}}>
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'64px',alignItems:'center'}}>
            <div style={{animation:'fadeUp 400ms ease both'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#E8F5EE',border:'1px solid rgba(30,122,86,0.2)',borderRadius:'999px',padding:'6px 14px',marginBottom:'28px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#26966B',animation:'pulse 2s ease infinite'}}/>
                <span style={{fontSize:'12px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#1E7A56'}}>Za lokalna podjetja · SLO &amp; HR</span>
              </div>
              <h1 className="hero-h1" style={{fontSize:'52px',fontWeight:800,color:'#17364D',lineHeight:1.06,letterSpacing:'-0.025em',marginBottom:'20px'}}>Vaše stranke<br/>se vračajo same.</h1>
              <p style={{fontSize:'17px',color:'#687985',lineHeight:1.7,maxWidth:'480px',marginBottom:'36px'}}>Carbonis reaktivira stare stranke, zbira Google ocene in zapolni urnik — brez klicanja, brez ročnega dela, brez tehničnega znanja.</p>
              <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'40px'}}>
                <a href="#panoge" style={{background:'#1E7A56',color:'#FFFFFF',borderRadius:'999px',padding:'15px 28px',fontSize:'15px',fontWeight:700,display:'inline-block'}}>Preverite za vaše podjetje</a>
                <a href="#kako-deluje" style={{border:'2px solid #E3EAE8',color:'#17364D',borderRadius:'999px',padding:'13px 24px',fontSize:'15px',fontWeight:600,display:'inline-block'}}>Kako deluje ↓</a>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
                {['Aktivno v 24 urah','GDPR · EU strežniki','Brez tehničnega znanja'].map(t => (
                  <span key={t} style={{display:'inline-flex',alignItems:'center',gap:'7px',background:'#E8F5EE',border:'1px solid rgba(30,122,86,0.18)',borderRadius:'999px',padding:'7px 14px',fontSize:'13px',fontWeight:600,color:'#1E7A56'}}>
                    <CheckIcon/>{t}
                  </span>
                ))}
              </div>
            </div>
            {/* Hero dashboard */}
            <div className="hero-dashboard-wrap" style={{position:'relative',animation:'fadeUp 500ms 150ms ease both'}}>
              <div style={{position:'absolute',inset:'-32px',background:'radial-gradient(ellipse at 60% 40%,rgba(38,150,107,0.12) 0%,transparent 70%)',pointerEvents:'none',borderRadius:'24px'}}/>
              <div style={{background:'#17364D',borderRadius:'16px',overflow:'hidden',boxShadow:'0 32px 80px rgba(23,54,77,0.28),0 0 0 1px rgba(255,255,255,0.05)',position:'relative'}}>
                <div style={{background:'#102B40',padding:'12px 18px',display:'flex',alignItems:'center',gap:'8px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div style={{display:'flex',gap:'5px'}}>
                    {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{width:'9px',height:'9px',borderRadius:'50%',background:c}}/>)}
                  </div>
                  <div style={{flex:1,textAlign:'center',fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.35)'}}>Carbonis · Nadzorna plošča</div>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#26966B',animation:'pulse 2s ease infinite'}}/>
                    <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',fontWeight:500}}>Aktivno</span>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'140px 1fr'}}>
                  <div style={{background:'#102B40',padding:'16px 0',borderRight:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{padding:'0 12px',marginBottom:'16px'}}><span style={{fontSize:'9px',fontWeight:700,color:'rgba(255,255,255,0.25)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Pregled</span></div>
                    {[{icon:'grid',label:'Nadzorna plošča',active:true},{icon:'users',label:'Stranke'},{icon:'msg',label:'Sporočila'},{icon:'star',label:'Ocene'},{icon:'cal',label:'Termini'}].map((item,i) => (
                      <div key={i} style={{padding:'8px 12px',margin:'0 8px',borderRadius:'6px',background:item.active?'rgba(38,150,107,0.15)':'transparent',display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                        <span style={{fontSize:'11px',fontWeight:item.active?600:400,color:item.active?'#FFFFFF':'rgba(255,255,255,0.4)'}}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:'16px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                      <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'12px'}}>
                        <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'6px'}}>Reaktivacija</div>
                        <div style={{fontSize:'22px',fontWeight:800,color:'#26966B',lineHeight:1,marginBottom:'2px'}}>72%</div>
                        <div style={{fontSize:'9px',color:'rgba(255,255,255,0.35)'}}>odzivnost · ilustrativno</div>
                        <div style={{display:'flex',alignItems:'flex-end',gap:'2px',height:'20px',marginTop:'8px'}}>
                          {[40,65,50,80,100].map((h,i) => (
                            <div key={i} style={{flex:1,background:i===4?'#26966B':`rgba(38,150,107,${0.2+i*0.1})`,borderRadius:'1px 1px 0 0',height:`${h}%`}}/>
                          ))}
                        </div>
                      </div>
                      <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'12px'}}>
                        <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'6px'}}>Google ocena</div>
                        <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'2px'}}><span style={{fontSize:'22px',fontWeight:800,color:'#FFFFFF',lineHeight:1}}>4.8</span><span style={{fontSize:'12px',color:'#26966B'}}>★</span></div>
                        <div style={{fontSize:'9px',color:'rgba(255,255,255,0.35)'}}>povprečje · ilustrativno</div>
                      </div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'8px',padding:'10px'}}>
                      <div style={{fontSize:'9px',fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'8px'}}>Zadnja aktivnost</div>
                      {[{init:'M',name:'Marija K.',action:'rezervirala termin',t:'2 min'},{init:'A',name:'Avtoservis Novak',action:'nova ocena ★★★★★',t:'14 min'},{init:'F',name:'Franc L.',action:'odgovoril na reaktivacijo',t:'1h'}].map((r,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:i<2?'7px':0}}>
                          <div style={{width:'22px',height:'22px',borderRadius:'50%',background:i===0?'#26966B':'rgba(255,255,255,0.1)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <span style={{fontSize:'9px',fontWeight:700,color:'#FFFFFF'}}>{r.init}</span>
                          </div>
                          <div style={{flex:1,minWidth:0}}><span style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.85)'}}>{r.name}</span><span style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}> {r.action}</span></div>
                          <span style={{fontSize:'9px',color:'rgba(255,255,255,0.25)',flexShrink:0}}>{r.t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{background:'#102B40',padding:'6px 18px',display:'flex',justifyContent:'center',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',fontWeight:500}}>Ilustrativni podatki — ne zagotovilo rezultatov</span>
                </div>
              </div>
              <div style={{position:'absolute',bottom:'-16px',left:'-16px',background:'#FFFFFF',borderRadius:'12px',padding:'12px 16px',boxShadow:'0 8px 24px rgba(23,54,77,0.14)',border:'1px solid #E3EAE8',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E7A56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div><div style={{fontSize:'13px',fontWeight:700,color:'#17364D'}}>24 kontaktov danes</div><div style={{fontSize:'11px',color:'#687985'}}>Nov termin · 16:30</div></div>
              </div>
            </div>
            {/* Mobile dashboard */}
            <div className="hero-mobile-dash" style={{display:'none',background:'#17364D',borderRadius:'12px',padding:'20px',marginTop:'8px'}}>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Ilustrativni prikaz · Carbonis</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
                {[{val:'72%',label:'Reaktivacija'},{val:'4.8★',label:'Google'},{val:'24/7',label:'Booking'}].map(s => (
                  <div key={s.label} style={{background:'rgba(255,255,255,0.07)',borderRadius:'8px',padding:'12px',textAlign:'center'}}>
                    <div style={{fontSize:'20px',fontWeight:800,color:s.label==='Reaktivacija'?'#26966B':'#FFFFFF'}}>{s.val}</div>
                    <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 TRUST BAND */}
      <section style={{background:'#E8F5EE',padding:'48px 0',borderTop:'1px solid rgba(30,122,86,0.1)',borderBottom:'1px solid rgba(30,122,86,0.1)'}}>
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div className="stat-strip" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,marginBottom:'32px'}}>
            {[{n:'6',label:'panog',sub:'avtoservisi, saloni, fitnes…'},{n:'24h',label:'postavitev',sub:'od podpisa do prvih sporočil'},{n:'SLO',label:'in HR trg',sub:'lokalni jeziki, EU zakonodaja'},{n:'GDPR',label:'skladno',sub:'podatki na EU strežnikih'}].map((s,i,arr) => (
              <div key={i} style={{textAlign:'center',padding:'0 24px',borderRight:i<arr.length-1?'1px solid rgba(30,122,86,0.15)':'none'}}>
                <div style={{fontSize:'40px',fontWeight:800,color:'#17364D',lineHeight:1,marginBottom:'4px'}}>{s.n}</div>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1E7A56',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
                <div style={{fontSize:'12px',color:'#687985',marginTop:'2px'}}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',justifyContent:'center'}}>
            {['Aktivno v 24 urah','GDPR · EU strežniki','Brez tehničnega znanja','Slovenija in Hrvaška','6 podprtih panog'].map(t => (
              <span key={t} style={{display:'inline-flex',alignItems:'center',gap:'7px',background:'#FFFFFF',border:'1px solid rgba(30,122,86,0.2)',borderRadius:'999px',padding:'8px 16px',fontSize:'13px',fontWeight:600,color:'#1E7A56'}}>
                <CheckIcon/>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 04 WHY CARBONIS */}
      <section style={{background:'#F5F8F7',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{maxWidth:'560px',marginBottom:'64px'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#1E7A56',marginBottom:'12px'}}>Zakaj Carbonis</div>
            <h2 className="h2-size" style={{fontSize:'38px',fontWeight:800,color:'#17364D',lineHeight:1.1,letterSpacing:'-0.015em',marginBottom:'16px'}}>Pasivna baza strank.<br/>Aktiviran prihodek.</h2>
            <p style={{fontSize:'16px',color:'#687985',lineHeight:1.7}}>Tri ključne zmožnosti, ki skupaj pretvorijo mirujočo bazo v stalni vir prihodka.</p>
          </div>

          {/* Benefit 1 */}
          <div className="why-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',marginBottom:'24px',alignItems:'stretch'}}>
            <div style={{background:'#FFFFFF',borderRadius:'16px',padding:'40px',border:'1px solid #E3EAE8',boxShadow:'0 4px 16px rgba(32,51,66,0.05)'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'24px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 style={{fontSize:'21px',fontWeight:700,color:'#17364D',marginBottom:'12px',lineHeight:1.3}}>Stranke, ki so bile zadovoljne, se vrnejo</h3>
              <p style={{fontSize:'15px',color:'#687985',lineHeight:1.7,marginBottom:'24px'}}>V vaši bazi spi denar. Stranke ki so bile pri vas in 3+ mesece niso prišle nazaj — ne zato ker niso bile zadovoljne, ampak ker jih nihče ni poklical. Carbonis to naredi namesto vas z osebnim sporočilom v pravem trenutku.</p>
              <div style={{height:'1px',background:'#E3EAE8',marginBottom:'20px'}}/>
              {['SMS, Email in WhatsApp sporočila','Osebna sporočila z imenom vašega podjetja','Avtomatsko sledenje in ukrepanje'].map(t => (
                <div key={t} style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'8px'}}><CheckIcon/><span style={{fontSize:'13px',fontWeight:600,color:'#203342'}}>{t}</span></div>
              ))}
            </div>
            <div style={{background:'#17364D',borderRadius:'16px',padding:'32px',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'center',minHeight:'320px'}}>
              <div style={{position:'absolute',top:'-40px',right:'-40px',width:'180px',height:'180px',borderRadius:'50%',background:'#26966B',opacity:0.08}}/>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.35)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'20px'}}>Sporočilo stranki</div>
              <div style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px',marginBottom:'12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#26966B',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:'12px',fontWeight:700,color:'#FFFFFF'}}>M</span></div>
                  <div><div style={{fontSize:'13px',fontWeight:700,color:'#FFFFFF'}}>Marija K.</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Spi v bazi · 4 mesece</div></div>
                  <div style={{marginLeft:'auto',background:'#26966B',borderRadius:'999px',padding:'3px 10px'}}><span style={{fontSize:'10px',fontWeight:700,color:'#FFFFFF'}}>Aktivna</span></div>
                </div>
                <div style={{background:'#102B40',borderRadius:'8px',padding:'12px'}}><p style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',lineHeight:1.6}}>Pozdravljeni Marija! Že kar nekaj časa vas nismo videli. Vas zanima termin ta teden? Rezervirajte v 2 minutah. — <strong style={{color:'#26966B'}}>Avtoservis Novak</strong></p></div>
              </div>
              <div style={{background:'rgba(38,150,107,0.12)',border:'1px solid rgba(38,150,107,0.2)',borderRadius:'10px',padding:'12px',display:'flex',alignItems:'center',gap:'10px'}}>
                <CheckIcon/><span style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.8)'}}>Marija je rezervirala termin · danes ob 10:30</span>
              </div>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="why-grid-rev" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',marginBottom:'24px',alignItems:'stretch'}}>
            <div style={{background:'#FFFFFF',borderRadius:'16px',padding:'32px',border:'1px solid #E3EAE8',display:'flex',flexDirection:'column',justifyContent:'center',minHeight:'280px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#687985',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>Booking sistem · 24/7</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'20px'}}>
                {[{day:'PON',time:'09:00',pct:100},{day:'PON',time:'11:30',pct:60},{day:'TOR',time:'14:00',active:true},{day:'TOR',time:'16:30',pct:80}].map((slot,i) => (
                  <div key={i} style={{background:slot.active?'#E8F5EE':'#F5F8F7',borderRadius:'6px',padding:'8px',textAlign:'center',border:`1px solid ${slot.active?'rgba(30,122,86,0.2)':'#E3EAE8'}`}}>
                    <div style={{fontSize:'10px',fontWeight:600,color:slot.active?'#1E7A56':'#687985'}}>{slot.day}</div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#17364D',marginTop:'2px'}}>{slot.time}</div>
                    {slot.active ? <div style={{fontSize:'9px',color:'#1E7A56',marginTop:'3px',fontWeight:700}}>Novo!</div> : <div style={{width:`${slot.pct}%`,height:'3px',background:'#26966B',borderRadius:'999px',marginTop:'4px'}}/>}
                  </div>
                ))}
              </div>
              <div style={{background:'#F5F8F7',borderRadius:'10px',padding:'14px',display:'flex',alignItems:'center',gap:'12px',border:'1px solid #E3EAE8'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#17364D',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div><div style={{fontSize:'13px',fontWeight:700,color:'#17364D'}}>Glasovni asistent sprejel klic</div><div style={{fontSize:'11px',color:'#687985'}}>med vašim delom · 17:42</div></div>
                <div style={{marginLeft:'auto'}}><span style={{fontSize:'11px',fontWeight:700,color:'#1E7A56',background:'#E8F5EE',borderRadius:'999px',padding:'4px 10px'}}>Termin potrjen</span></div>
              </div>
            </div>
            <div style={{background:'#FFFFFF',borderRadius:'16px',padding:'40px',border:'1px solid #E3EAE8',boxShadow:'0 4px 16px rgba(32,51,66,0.05)'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'24px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 style={{fontSize:'21px',fontWeight:700,color:'#17364D',marginBottom:'12px',lineHeight:1.3}}>Vsak klic sprejet, vsak termin potrjen</h3>
              <p style={{fontSize:'15px',color:'#687985',lineHeight:1.7,marginBottom:'24px'}}>Booking sistem in glasovni asistent poskrbita, da nobeno povpraševanje ne ostane brez odgovora — niti med delom, niti zvečer. Vi delate. Sistem dela z vami.</p>
              <div style={{height:'1px',background:'#E3EAE8',marginBottom:'20px'}}/>
              {['Spletni booking 24/7','Glasovni asistent za dohodne klice (Pro)','Samodejne potrditve in opomniki'].map(t => (
                <div key={t} style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'8px'}}><CheckIcon/><span style={{fontSize:'13px',fontWeight:600,color:'#203342'}}>{t}</span></div>
              ))}
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="why-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',alignItems:'stretch'}}>
            <div style={{background:'#FFFFFF',borderRadius:'16px',padding:'40px',border:'1px solid #E3EAE8',boxShadow:'0 4px 16px rgba(32,51,66,0.05)'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'24px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7A56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3 style={{fontSize:'21px',fontWeight:700,color:'#17364D',marginBottom:'12px',lineHeight:1.3}}>Ugled, ki ga gradijo vaše stranke</h3>
              <p style={{fontSize:'15px',color:'#687985',lineHeight:1.7,marginBottom:'24px'}}>Po vsaki storitvi stranka dobi prošnjo za oceno. Vaš Google profil raste organsko — brez vašega posredovanja. Novi kupci vas najdejo, preden se sploh odločijo.</p>
              <div style={{height:'1px',background:'#E3EAE8',marginBottom:'20px'}}/>
              {['Samodejne prošnje po vsakem obisku','AI odgovori na Google ocene (Growth, Pro)','Organsko boljši položaj na Googlu'].map(t => (
                <div key={t} style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'8px'}}><CheckIcon/><span style={{fontSize:'13px',fontWeight:600,color:'#203342'}}>{t}</span></div>
              ))}
            </div>
            <div style={{background:'#FFFFFF',borderRadius:'16px',padding:'32px',border:'1px solid #E3EAE8',display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:'12px',marginBottom:'16px'}}>
                <div style={{fontSize:'64px',fontWeight:800,color:'#17364D',lineHeight:1,letterSpacing:'-0.03em'}}>4.8</div>
                <div>
                  <div style={{display:'flex',gap:'3px',marginBottom:'4px'}}>
                    {[1,2,3,4].map(i => <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#26966B" stroke="#26966B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E3EAE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div style={{fontSize:'12px',color:'#687985'}}>povprečna ocena · ilustrativno</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {[{stars:5,pct:75},{stars:4,pct:18},{stars:3,pct:5},{stars:2,pct:1},{stars:1,pct:1}].map(r => (
                  <div key={r.stars} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <span style={{fontSize:'12px',color:'#687985',width:'16px',textAlign:'right',flexShrink:0}}>{r.stars}</span>
                    <div style={{flex:1,height:'8px',background:'#E3EAE8',borderRadius:'999px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${r.pct}%`,background:'#26966B',borderRadius:'999px',opacity:r.stars<5?0.4+r.stars*0.1:1}}/>
                    </div>
                    <span style={{fontSize:'12px',color:'#687985',width:'28px',flexShrink:0}}>{r.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'16px',padding:'10px 14px',background:'#F5F8F7',borderRadius:'8px',fontSize:'12px',color:'#687985'}}>Ilustrativni prikaz — ne zagotovilo vaših rezultatov</div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 HOW IT WORKS */}
      <section id="kako-deluje" style={{background:'#FFFFFF',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',maxWidth:'560px',margin:'0 auto 64px'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#1E7A56',marginBottom:'12px'}}>Postavljeno v 24 urah</div>
            <h2 className="h2-size" style={{fontSize:'38px',fontWeight:800,color:'#17364D',lineHeight:1.1,letterSpacing:'-0.015em',marginBottom:'16px'}}>Štirje koraki do prvih kontaktov.</h2>
            <p style={{fontSize:'16px',color:'#687985',lineHeight:1.7}}>Ni tehničnega znanja potrebno. Prinesete kar imate — seznam, Excel, ali karkoli drugega. V 7–14 dneh vidite prve odzive.</p>
          </div>
          <div className="process-grid" style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr auto 1fr',alignItems:'start',gap:0}}>
            {[
              {n:'01',title:'Poveste nam o svojih strankah',desc:'Prinesete kar imate — seznam, Excel, foto papirja. Uredimo za vas.'},
              {n:'02',title:'Sistem se postavi za vas',desc:'V 24 urah je vse pripravljeno. Nobenih tehničnih znanj.'},
              {n:'03',title:'Stare stranke se začnejo odzivati',desc:'V 7–14 dneh vidite prve odzive. Sistem sledi in ukrepa.'},
              {n:'04',title:'Sistem dela naprej sam',desc:'Vi se fokusirate na vaše delo. Ostalo je naše.',last:true},
            ].map((step, i, arr) => (
              <>
                <div key={step.n} style={{textAlign:'center',padding:'0 12px'}}>
                  <div style={{width:'64px',height:'64px',borderRadius:'16px',background:step.last?'#1E7A56':'#E8F5EE',border:`2px solid ${step.last?'#1E7A56':'#26966B'}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                    <span style={{fontSize:'26px',fontWeight:800,color:step.last?'#FFFFFF':'#1E7A56'}}>{step.n}</span>
                  </div>
                  <div style={{background:step.last?'#17364D':'#F5F8F7',borderRadius:'12px',padding:'20px',border:`1px solid ${step.last?'#17364D':'#E3EAE8'}`}}>
                    <h3 style={{fontSize:'16px',fontWeight:700,color:step.last?'#FFFFFF':'#17364D',marginBottom:'8px',lineHeight:1.3}}>{step.title}</h3>
                    <p style={{fontSize:'13px',color:step.last?'rgba(255,255,255,0.65)':'#687985',lineHeight:1.6}}>{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div key={`c${i}`} className="process-connector" style={{display:'flex',alignItems:'flex-start',paddingTop:'32px',width:'40px',justifyContent:'center'}}>
                    <div style={{position:'relative',width:'100%'}}>
                      <div style={{height:'2px',background:i===2?'#26966B':'#E3EAE8',width:'100%'}}/>
                      <div style={{position:'absolute',right:'-4px',top:'-4px',width:0,height:0,borderTop:'5px solid transparent',borderBottom:'5px solid transparent',borderLeft:`8px solid ${i===2?'#26966B':'#E3EAE8'}`}}/>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* 06 DASHBOARD SHOWCASE */}
      <section style={{background:'#17364D',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',maxWidth:'560px',margin:'0 auto 48px'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#26966B',marginBottom:'12px'}}>Nadzorna plošča</div>
            <h2 className="h2-size" style={{fontSize:'38px',fontWeight:800,color:'#FFFFFF',lineHeight:1.1,letterSpacing:'-0.015em',marginBottom:'16px'}}>Vse v eni pregledni plošči.</h2>
            <p style={{fontSize:'16px',color:'rgba(255,255,255,0.55)',lineHeight:1.7}}>Reaktivacija strank, Google ocene, booking sistem in analitika — vse na enem mestu, brez tehničnega znanja.</p>
          </div>
          <div style={{background:'#102B40',borderRadius:'16px',overflow:'hidden',boxShadow:'0 40px 100px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.06)'}}>
            <div style={{background:'#0D2236',padding:'14px 24px',display:'flex',alignItems:'center',gap:'12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'flex',gap:'6px'}}>{['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{width:'10px',height:'10px',borderRadius:'50%',background:c}}/>)}</div>
              <div style={{flex:1,textAlign:'center'}}><span style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.35)'}}>Carbonis · Nadzorna plošča · Avtoservis Novak</span></div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(38,150,107,0.15)',border:'1px solid rgba(38,150,107,0.25)',borderRadius:'999px',padding:'4px 12px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#26966B',animation:'pulse 2s ease infinite'}}/>
                <span style={{fontSize:'11px',color:'#26966B',fontWeight:600}}>Aktivno</span>
              </div>
              <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',padding:'4px 10px'}}><span style={{fontSize:'10px',color:'rgba(255,255,255,0.35)'}}>Ilustrativni podatki</span></div>
            </div>
            <div className="dash-main-grid" style={{display:'grid',gridTemplateColumns:'200px 1fr'}}>
              <div style={{background:'#0D2236',padding:'20px 0',borderRight:'1px solid rgba(255,255,255,0.05)'}}>
                <div style={{padding:'0 16px',marginBottom:'20px'}}><span style={{fontSize:'10px',fontWeight:700,color:'rgba(255,255,255,0.2)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Pregled</span></div>
                {[{label:'Nadzorna plošča',active:true},{label:'Baza strank'},{label:'Sporočila'},{label:'Google ocene'},{label:'Booking'}].map((item,i) => (
                  <div key={i} style={{padding:'10px 16px',margin:'0 10px',borderRadius:'8px',background:item.active?'rgba(38,150,107,0.15)':'transparent',display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                    <span style={{fontSize:'13px',fontWeight:item.active?600:400,color:item.active?'#FFFFFF':'rgba(255,255,255,0.4)'}}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:'24px'}}>
                <div className="dash-stat-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'20px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                      <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Reaktivacija</div>
                      <div style={{background:'rgba(38,150,107,0.15)',borderRadius:'999px',padding:'3px 10px'}}><span style={{fontSize:'10px',fontWeight:600,color:'#26966B'}}>SMS · Email · WA</span></div>
                    </div>
                    <div style={{fontSize:'36px',fontWeight:800,color:'#26966B',lineHeight:1,marginBottom:'4px'}}>72%</div>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginBottom:'16px'}}>odzivnost · ilustrativno</div>
                    <div style={{display:'flex',alignItems:'flex-end',gap:'3px',height:'40px'}}>
                      {[35,50,65,45,80,70,90,100].map((h,i) => (
                        <div key={i} style={{flex:1,height:`${h}%`,background:i===7?'#26966B':`rgba(38,150,107,${0.2+i*0.05})`,borderRadius:'2px 2px 0 0'}}/>
                      ))}
                    </div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'20px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                      <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Google ocene</div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#26966B" stroke="#26966B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'4px'}}><span style={{fontSize:'36px',fontWeight:800,color:'#FFFFFF',lineHeight:1}}>4.8</span><span style={{fontSize:'20px',color:'#26966B'}}>★</span></div>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginBottom:'16px'}}>povprečna ocena · ilustrativno</div>
                    <div style={{display:'flex',gap:'2px',marginBottom:'8px'}}>
                      <div style={{height:'5px',flex:4,background:'#26966B',borderRadius:'999px'}}/>
                      <div style={{height:'5px',flex:1,background:'rgba(255,255,255,0.1)',borderRadius:'999px'}}/>
                    </div>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>89% odzivnost na prošnjo · ilustrativno</div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'20px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                      <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Booking</div>
                      <div style={{background:'rgba(38,150,107,0.15)',borderRadius:'999px',padding:'3px 10px'}}><span style={{fontSize:'10px',fontWeight:600,color:'#26966B'}}>24/7</span></div>
                    </div>
                    <div style={{fontSize:'36px',fontWeight:800,color:'#FFFFFF',lineHeight:1,marginBottom:'4px'}}>12</div>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginBottom:'16px'}}>terminov ta teden</div>
                    {['Marija K. · 09:00','Janez N. · 11:30'].map(t => (
                      <div key={t} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.05)',borderRadius:'6px',padding:'7px 10px',marginBottom:'6px'}}>
                        <span style={{fontSize:'11px',color:'rgba(255,255,255,0.7)'}}>{t}</span><span style={{fontSize:'10px',fontWeight:600,color:'#26966B'}}>Potrjeno</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dash-stat-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
                  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'20px'}}>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:'16px'}}>Kanali komunikacije</div>
                    {[{label:'SMS',pct:68},{label:'Email',pct:24},{label:'WhatsApp',pct:8}].map(ch => (
                      <div key={ch.label} style={{marginBottom:'14px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{ch.label}</span><span style={{fontSize:'13px',fontWeight:700,color:'#26966B'}}>{ch.pct}%</span></div>
                        <div style={{height:'7px',background:'rgba(255,255,255,0.08)',borderRadius:'999px',overflow:'hidden'}}><div style={{height:'100%',width:`${ch.pct}%`,background:'#26966B',borderRadius:'999px'}}/></div>
                      </div>
                    ))}
                    <div style={{marginTop:'4px',padding:'8px 12px',background:'rgba(255,255,255,0.04)',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.06)'}}><span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>Ilustrativni podatki — ne zagotovilo rezultatov</span></div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'20px'}}>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:'16px'}}>Zadnja aktivnost</div>
                    {[{init:'M',name:'Marija K.',action:'rezervirala termin za torek',t:'2 min',active:true},{init:'A',name:'Avtoservis Novak',action:'nova ocena ★★★★★ na Googlu',t:'14 min'},{init:'F',name:'Franc L.',action:'odgovoril na reaktivacijo',t:'1h'},{init:'T',name:'Tina M.',action:'aktivirana po 3 mesecih mirovanja',t:'2h'}].map((r,i,arr) => (
                      <div key={i}>
                        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                          <div style={{width:'30px',height:'30px',borderRadius:'50%',background:r.active?'#26966B':'rgba(255,255,255,0.08)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <span style={{fontSize:'11px',fontWeight:700,color:r.active?'#FFFFFF':'rgba(255,255,255,0.5)'}}>{r.init}</span>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.85)'}}>{r.name}</div>
                            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{r.action}</div>
                          </div>
                          <span style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',flexShrink:0}}>{r.t}</span>
                        </div>
                        {i<arr.length-1 && <div style={{height:'1px',background:'rgba(255,255,255,0.05)',margin:'11px 0'}}/>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 INDUSTRIES */}
      <section id="panoge" style={{background:'#FFFFFF',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',maxWidth:'560px',margin:'0 auto 48px'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#1E7A56',marginBottom:'12px'}}>Prilagojeno vaši panogi</div>
            <h2 className="h2-size" style={{fontSize:'38px',fontWeight:800,color:'#17364D',lineHeight:1.1,letterSpacing:'-0.015em',marginBottom:'16px'}}>Izberite svojo panogo</h2>
            <p style={{fontSize:'16px',color:'#687985',lineHeight:1.7}}>Carbonis se prilagodi vaši branži — pravi timing, sporočila in pristop za vsako vrsto lokalnega podjetja.</p>
          </div>
          <div style={{display:'flex',gap:'8px',marginBottom:'32px',flexWrap:'wrap',justifyContent:'center'}}>
            {INDUSTRIES.map((industry, i) => (
              <button key={i} onClick={() => setActiveIndustry(i)} style={{borderRadius:'999px',padding:'10px 20px',fontSize:'14px',fontWeight:i===activeIndustry?700:500,background:i===activeIndustry?'#17364D':'transparent',color:i===activeIndustry?'#FFFFFF':'#687985',border:`2px solid ${i===activeIndustry?'#17364D':'#E3EAE8'}`,transition:'all 150ms',cursor:'pointer',whiteSpace:'nowrap'}}>
                {industry.label}
              </button>
            ))}
          </div>
          <div className="industry-content-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',alignItems:'start'}}>
            <div style={{background:'#F5F8F7',borderRadius:'16px',padding:'40px',border:'1px solid #E3EAE8'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#1E7A56',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>{ind.label}</div>
              <h3 style={{fontSize:'22px',fontWeight:700,color:'#17364D',lineHeight:1.3,marginBottom:'16px'}}>{ind.problem}</h3>
              <p style={{fontSize:'14px',color:'#687985',lineHeight:1.7,marginBottom:'24px'}}>{ind.details}</p>
              <div style={{height:'1px',background:'#E3EAE8',marginBottom:'24px'}}/>
              <div style={{fontSize:'13px',fontWeight:700,color:'#17364D',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Rešitev</div>
              <p style={{fontSize:'15px',color:'#203342',lineHeight:1.7,marginBottom:'28px'}}>{ind.solution}</p>
              <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#1E7A56',color:'#FFFFFF',borderRadius:'999px',padding:'13px 24px',fontSize:'14px',fontWeight:700}}>Brezplačen pregled za {ind.label} →</Link>
            </div>
            <div>
              <div style={{background:'#17364D',borderRadius:'16px',padding:'32px',marginBottom:'16px',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:'-30px',right:'-30px',width:'140px',height:'140px',borderRadius:'50%',background:'#26966B',opacity:0.1}}/>
                <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'16px',position:'relative'}}>Ocena potenciala · Ilustrativno</div>
                <div style={{fontSize:'48px',fontWeight:800,color:'#26966B',lineHeight:1,marginBottom:'4px',position:'relative'}}>{ind.calcResult}</div>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'20px',position:'relative'}}>mesečni prihodek · ocena, ni zagotovilo</div>
                <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'16px',position:'relative'}}>
                  <div style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:'8px'}}>Formula izračuna</div>
                  <div style={{fontSize:'14px',color:'rgba(255,255,255,0.8)',fontWeight:600,lineHeight:1.6}}>{ind.calcLabel}</div>
                  <div style={{marginTop:'8px',fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>= {ind.calcResult} / mes · ilustrativna ocena</div>
                </div>
              </div>
              <div style={{background:'#E8F5EE',borderRadius:'12px',padding:'20px',border:'1px solid rgba(30,122,86,0.15)'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#17364D',marginBottom:'8px'}}>Z Carbonis vključite:</div>
                {['Reaktivacija neaktivnih strank','Samodejno zbiranje Google ocen','Booking sistem za spletna naročila'].map(t => (
                  <div key={t} style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'6px'}}><CheckIcon/><span style={{fontSize:'13px',color:'#203342'}}>{t}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08 PRICING */}
      <section id="paketi" style={{background:'#F5F8F7',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',maxWidth:'560px',margin:'0 auto 48px'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#1E7A56',marginBottom:'12px'}}>Transparentne cene</div>
            <h2 className="h2-size" style={{fontSize:'38px',fontWeight:800,color:'#17364D',lineHeight:1.1,letterSpacing:'-0.015em',marginBottom:'16px'}}>Brez presenečenj.<br/>Brez skritih stroškov.</h2>
            <p style={{fontSize:'16px',color:'#687985',lineHeight:1.7}}>Brez začetne postavitve. Starter in Growth: odpoveste kadarkoli.</p>
          </div>
          <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'20px',alignItems:'stretch'}}>
            {[
              {tier:'Starter',price:'149',color:'#687985',desc:'Manjša podjetja, ki želijo preveriti ali sistem deluje',features:['Reaktivacija starih strank (SMS)','Zbiranje Google ocen','Follow-up sekvence','Mini poročila'],missing:['Voice klici','GEO vidljivost','Booking sistem'],cta:'Začni s Starter',sub:'Odpoveste kadarkoli',featured:false},
              {tier:'Growth',price:'249',color:'#1E7A56',desc:'Podjetja, ki želijo rast na vseh kanalih',features:['Vse iz Starter paketa','Uvoz baze strank','GEO/AI vidljivost','Booking sistem','Polni dashboard','AI odgovori na ocene','Voice klici (outbound)'],missing:[],cta:'Začni s Growth',sub:'Odpoveste kadarkoli',featured:true},
              {tier:'Pro',price:'349',color:'#687985',desc:'Podjetja, ki hočejo maksimalne rezultate',features:['Vse iz Growth paketa','Glasovni asistent 24/7','Glasovni klici starim strankam','Dedicirani telefon (SI/HR)','Prioritetna podpora'],missing:[],cta:'Začni s Pro',sub:'12-mesečna pogodba',featured:false},
            ].map(plan => (
              <div key={plan.tier} style={{background:'#FFFFFF',borderRadius:'16px',padding:'32px',border:plan.featured?'2px solid #17364D':'1px solid #E3EAE8',boxShadow:plan.featured?'0 8px 32px rgba(23,54,77,0.12)':'0 4px 16px rgba(32,51,66,0.05)',display:'flex',flexDirection:'column',position:'relative'}}>
                {plan.featured && <div style={{position:'absolute',top:'-14px',left:'50%',transform:'translateX(-50%)',background:'#17364D',color:'#FFFFFF',borderRadius:'999px',padding:'5px 16px',fontSize:'12px',fontWeight:700,whiteSpace:'nowrap'}}>Najpopularnejši</div>}
                <div style={{marginBottom:'24px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:plan.color,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'12px'}}>{plan.tier}</div>
                  <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'4px'}}><span style={{fontSize:'40px',fontWeight:800,color:'#17364D',lineHeight:1}}>{plan.price}</span><span style={{fontSize:'18px',fontWeight:600,color:'#687985'}}>€/mes</span></div>
                  <div style={{fontSize:'13px',color:'#687985',lineHeight:1.5}}>{plan.desc}</div>
                </div>
                <div style={{height:'1px',background:'#E3EAE8',marginBottom:'24px'}}/>
                <div style={{display:'flex',flexDirection:'column',gap:'11px',flex:1,marginBottom:'28px'}}>
                  {plan.features.map((f,i) => <div key={f} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}><CheckIcon/><span style={{fontSize:'14px',color:'#203342',fontWeight:i===0&&plan.tier!=='Starter'?600:400}}>{f}</span></div>)}
                  {plan.missing.map(f => <div key={f} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}><XIcon/><span style={{fontSize:'14px',color:'#687985'}}>{f}</span></div>)}
                </div>
                <Link href="/register" style={{display:'block',textAlign:'center',background:plan.featured?'#1E7A56':'transparent',color:plan.featured?'#FFFFFF':'#17364D',border:plan.featured?'none':'2px solid #E3EAE8',borderRadius:'999px',padding:plan.featured?'15px 24px':'13px 24px',fontSize:'15px',fontWeight:700}}>{plan.cta}</Link>
                <div style={{textAlign:'center',fontSize:'12px',color:'#687985',marginTop:'12px'}}>{plan.sub}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'24px',fontSize:'13px',color:'#687985'}}>Vsi paketi vključujejo brezplačno postavitev · Brez skritih stroškov</div>
        </div>
      </section>

      {/* 09 FAQ */}
      <section id="faq" style={{background:'#FFFFFF',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div className="faq-grid" style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'80px',alignItems:'start'}}>
            <div style={{position:'sticky',top:'100px'}}>
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#1E7A56',marginBottom:'12px'}}>FAQ</div>
              <h2 className="h2-size" style={{fontSize:'38px',fontWeight:800,color:'#17364D',lineHeight:1.1,letterSpacing:'-0.015em',marginBottom:'16px'}}>Pogosta vprašanja</h2>
              <p style={{fontSize:'15px',color:'#687985',lineHeight:1.7,marginBottom:'28px'}}>Niste našli odgovora? Pogovorite se z Vero — odgovori takoj.</p>
              <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#1E7A56',color:'#FFFFFF',borderRadius:'999px',padding:'13px 22px',fontSize:'14px',fontWeight:700}}>Pogovorite se z Vero →</Link>
            </div>
            <div style={{borderTop:'1px solid #E3EAE8'}}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{borderBottom:'1px solid #E3EAE8',borderLeft:`3px solid ${openFaq===i?'#1E7A56':'transparent'}`,paddingLeft:'20px',transition:'border-color 200ms'}}>
                  <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{width:'100%',textAlign:'left',padding:'24px 0',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                    <span style={{fontSize:'16px',fontWeight:600,color:'#17364D',lineHeight:1.4,textAlign:'left'}}>{faq.q}</span>
                    <div style={{width:'28px',height:'28px',borderRadius:'50%',border:'1.5px solid #E3EAE8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transform:openFaq===i?'rotate(180deg)':'rotate(0deg)',transition:'transform 250ms'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1E7A56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </button>
                  <div style={{overflow:'hidden',maxHeight:openFaq===i?'300px':'0px',transition:'max-height 300ms ease-out'}}>
                    <p style={{fontSize:'15px',color:'#687985',lineHeight:1.7,paddingBottom:'24px'}}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10 FINAL CTA */}
      <section style={{background:'#17364D',padding:'96px 0'}} className="section-pad">
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{maxWidth:'680px',margin:'0 auto',textAlign:'center',position:'relative'}}>
            <div style={{position:'absolute',top:'-64px',left:'50%',transform:'translateX(-50%)',width:'300px',height:'300px',borderRadius:'50%',background:'#26966B',opacity:0.06,pointerEvents:'none'}}/>
            <div style={{position:'relative'}}>
              <div style={{width:'48px',height:'3px',background:'#26966B',borderRadius:'999px',margin:'0 auto 28px'}}/>
              <h2 className="h2-size" style={{fontSize:'40px',fontWeight:800,color:'#FFFFFF',lineHeight:1.1,letterSpacing:'-0.02em',marginBottom:'20px'}}>Preverite koliko strank<br/>spi v vaši bazi.</h2>
              <p style={{fontSize:'17px',color:'rgba(255,255,255,0.6)',lineHeight:1.7,marginBottom:'40px',maxWidth:'480px',margin:'0 auto 40px'}}>Brezplačen pogovor o vaši situaciji. Povemo kaj vidimo in kaj bi bilo smiselno storiti. Brez obveznosti.</p>
              <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',marginBottom:'32px'}}>
                <Link href="/register" style={{display:'inline-block',background:'#26966B',color:'#FFFFFF',borderRadius:'999px',padding:'16px 32px',fontSize:'16px',fontWeight:700}}>Začnite brezplačno →</Link>
                <a href="#kako-deluje" style={{display:'inline-block',border:'2px solid rgba(255,255,255,0.2)',color:'#FFFFFF',borderRadius:'999px',padding:'14px 28px',fontSize:'16px',fontWeight:600}}>Kako deluje</a>
              </div>
              <div style={{display:'flex',gap:'20px',justifyContent:'center',flexWrap:'wrap'}}>
                {['Aktivno v 24 urah','GDPR skladno','Brez tehničnega znanja'].map(t => (
                  <span key={t} style={{fontSize:'13px',color:'rgba(255,255,255,0.45)',display:'flex',alignItems:'center',gap:'6px'}}><CheckIcon/>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 FOOTER */}
      <footer style={{background:'#102B40',padding:'64px 0 32px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="container" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'40px',marginBottom:'48px'}}>
            <div>
              <Link href="/"><img src="/carbonis-logo.png" alt="Carbonis" style={{height:'50px',width:'auto',filter:'brightness(0) invert(1)',marginBottom:'16px'}}/></Link>
              <p style={{fontSize:'14px',color:'rgba(255,255,255,0.45)',lineHeight:1.7,maxWidth:'280px',marginBottom:'20px'}}>Sistem, ki reaktivira stare stranke, zbira Google ocene in zapolni urnik. Za lokalna podjetja v Sloveniji in na Hrvaškem.</p>
              <a href="mailto:info@carbonis.eu" style={{fontSize:'14px',fontWeight:600,color:'rgba(255,255,255,0.6)'}}>info@carbonis.eu</a>
            </div>
            <div>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'16px'}}>Navigacija</div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {[['Kako deluje','#kako-deluje'],['Panoge','#panoge'],['Paketi','#paketi'],['FAQ','#faq']].map(([l,h]) => (
                  <a key={l} href={h} style={{fontSize:'14px',color:'rgba(255,255,255,0.55)'}}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'16px'}}>Račun</div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <Link href="/login" style={{fontSize:'14px',color:'rgba(255,255,255,0.55)'}}>Prijava</Link>
                <Link href="/register" style={{fontSize:'14px',color:'rgba(255,255,255,0.55)'}}>Brezplačen začetek</Link>
              </div>
            </div>
            <div>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'16px'}}>Pravno</div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <Link href="/politika-zasebnosti" style={{fontSize:'14px',color:'rgba(255,255,255,0.55)'}}>Politika zasebnosti</Link>
                <Link href="/pogoji-uporabe" style={{fontSize:'14px',color:'rgba(255,255,255,0.55)'}}>Pogoji uporabe</Link>
              </div>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.3)'}}>© 2026 Carbonis · EU strežniki · GDPR skladno</div>
            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.2)'}}>EU strežniki</span>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.2)'}}>GDPR · Zakon o varstvu podatkov</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
