import Link from 'next/link'
import IndustrySelector from './components/IndustrySelector'

const navy = '#102A56'
const cobalt = '#356AE6'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', color: '#172033' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none}
        button{cursor:pointer;border:none;background:none}
        .nl{color:#5D687A;font-size:14px;transition:color .15s}
        .nl:hover{color:#102A56}
        .fc{transition:background .2s}
        .fc:hover{background:#F7F8FA!important}
        .it{transition:all .2s;cursor:pointer}
        .it:hover{border-color:#356AE6!important;background:#EEF2FF!important}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .f1{animation:float 6s ease-in-out infinite}
        .f2{animation:float 6s 2s ease-in-out infinite}
        details>summary{list-style:none;cursor:pointer}
        details>summary::-webkit-details-marker{display:none}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .dot-live{animation:pulse 2s infinite}
        @media(max-width:900px){
          .hero-inner{flex-direction:column!important;padding:48px 20px 56px!important;gap:40px!important}
          .hero-left{flex:unset!important;max-width:100%!important}
          .hero-right{display:none!important}
          .benefits-grid{grid-template-columns:1fr!important}
          .industry-wrap{flex-direction:column!important;gap:32px!important}
          .proc-wrap{flex-direction:column!important;gap:40px!important}
          .faq-wrap{flex-direction:column!important;gap:32px!important}
          .cta-wrap{flex-direction:column!important;gap:32px!important}
          .pkg-grid{grid-template-columns:1fr!important}
          .pkg-mid{transform:none!important}
          .footer-top{flex-direction:column!important;gap:20px!important}
          .footer-bot{flex-direction:column!important;gap:12px!important;align-items:flex-start!important}
        }
        @media(max-width:600px){
          .nav-links{display:none!important}
          .hero-ctas{flex-direction:column!important}
          .benefits-border-r{border-right:none!important;border-bottom:1px solid #E0E5ED!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'white',borderBottom:'1px solid #E0E5ED',boxShadow:'0 1px 8px rgba(0,0,0,0.04)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/"><img src="/carbonis-logo.png" alt="Carbonis" style={{height:'40px',width:'auto'}}/></Link>
          <div className="nav-links" style={{display:'flex',gap:'28px',alignItems:'center'}}>
            <a href="#kako-deluje" className="nl">Kako deluje</a>
            <a href="#panoge" className="nl">Panoge</a>
            <a href="#paketi" className="nl">Paketi</a>
            <a href="#faq" className="nl">FAQ</a>
          </div>
          <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
            <Link href="/login" style={{color:'#5D687A',fontSize:'14px',fontWeight:500}}>Prijava</Link>
            <Link href="/register" style={{background:cobalt,color:'white',fontSize:'14px',fontWeight:600,padding:'9px 20px',borderRadius:'8px',display:'inline-flex',alignItems:'center',gap:'5px'}}>Začnite brezplačno →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{background:'linear-gradient(160deg,#06101e 0%,#0d1d3b 50%,#081424 100%)',minHeight:'680px',position:'relative',overflow:'hidden',display:'flex',alignItems:'center'}}>
        {/* background glow */}
        <div style={{position:'absolute',top:'50%',right:'5%',transform:'translateY(-50%)',width:'700px',height:'700px',borderRadius:'50%',background:`radial-gradient(circle at center,${cobalt}22 0%,${cobalt}06 50%,transparent 75%)`,pointerEvents:'none'}}/>
        <div className="hero-inner" style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 32px',display:'flex',alignItems:'center',gap:'60px',width:'100%',position:'relative',zIndex:2}}>

          {/* Left */}
          <div className="hero-left" style={{flex:'0 0 520px',maxWidth:'520px'}}>
            <p style={{color:'#7fa8e0',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'22px'}}>Za lokalna podjetja · Slovenija & Hrvaška</p>
            <h1 style={{fontSize:'52px',fontWeight:800,lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:'24px'}}>
              <span style={{color:'white',display:'block'}}>Več ponovnih obiskov.</span>
              <span style={{color:cobalt,display:'block'}}>Manj ročnega dela.</span>
            </h1>
            <p style={{color:'#8fa8c8',fontSize:'16px',lineHeight:1.75,marginBottom:'32px',maxWidth:'440px'}}>
              Carbonis pomaga lokalnim podjetjem znova nagovoriti obstoječe stranke, lažje upravljati povpraševanje in graditi zaupanje — brez dodatnega dela za vas.
            </p>
            <div className="hero-ctas" style={{display:'flex',gap:'12px',marginBottom:'40px',flexWrap:'wrap'}}>
              <a href="#panoge" style={{background:cobalt,color:'white',fontSize:'14px',fontWeight:600,padding:'12px 26px',borderRadius:'8px',display:'inline-flex',alignItems:'center',gap:'6px'}}>Preverite za vaše podjetje →</a>
              <a href="#kako-deluje" style={{color:'white',fontSize:'14px',fontWeight:500,padding:'12px 24px',borderRadius:'8px',border:'1.5px solid rgba(255,255,255,0.2)',display:'inline-flex',alignItems:'center'}}>Kako deluje ↓</a>
            </div>
            <div style={{display:'flex',gap:'28px',flexWrap:'wrap'}}>
              {[['Brez tehničnega znanja','—'],['V 24 urah aktivno','—'],['EU strežniki · GDPR','—']].map(([l]) => (
                <div key={l} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5L5 9 10.5 4" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <span style={{color:'#7fa8e0',fontSize:'13px'}}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product demo */}
          <div className="hero-right" style={{flex:1,position:'relative',minHeight:'520px'}}>
            {/* Main dashboard card */}
            <div style={{position:'absolute',right:'20px',top:'50%',transform:'translateY(-50%)',width:'340px',background:'rgba(6,12,28,0.92)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:'16px',overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.4)'}}>
              <div style={{padding:'12px 18px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{color:'rgba(255,255,255,0.7)',fontSize:'11px',fontWeight:600}}>Carbonis · Pregled</span>
                <span style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)',fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:'4px',letterSpacing:'0.08em'}}>DEMO</span>
              </div>
              <div style={{padding:'16px 18px'}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'16px'}}>
                  {[
                    {l:'Stranke kontaktirane',c:'#4ade80'},
                    {l:'Novih ocen',c:'#f59e0b'},
                    {l:'Zasedenost',c:'#60a5fa'},
                  ].map((k,i) => (
                    <div key={i} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'10px 8px'}}>
                      <div style={{color:'rgba(255,255,255,0.4)',fontSize:'7.5px',marginBottom:'6px',lineHeight:1.3}}>{k.l}</div>
                      <div style={{color:k.c,fontSize:'18px',fontWeight:800}}>—</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'8px',padding:'10px',marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                    <span style={{color:'rgba(255,255,255,0.4)',fontSize:'9px'}}>Aktivnost · 6 mes</span>
                  </div>
                  <svg viewBox="0 0 280 50" style={{width:'100%'}}>
                    <path d="M0 44 Q46 40 93 33 Q140 26 187 19 Q234 13 280 8" fill="none" stroke={cobalt} strokeWidth="2"/>
                    <path d="M0 44 Q46 40 93 33 Q140 26 187 19 Q234 13 280 8 L280 50 L0 50Z" fill="url(#hg)"/>
                    <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={cobalt} stopOpacity="0.25"/><stop offset="100%" stopColor={cobalt} stopOpacity="0"/></linearGradient></defs>
                    {['Maj','Jun','Jul','Avg','Sep','Okt'].map((m,i) => <text key={m} x={i*56} y="49" fill="rgba(255,255,255,0.25)" fontSize="7">{m}</text>)}
                  </svg>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  {[
                    {init:'M',action:'naročen termin',c:'#4ade80'},
                    {init:'S',action:'pustila oceno',c:'#f59e0b'},
                    {init:'R',action:'sprejel povabilo',c:'#60a5fa'},
                  ].map((r,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',background:'rgba(255,255,255,0.03)',borderRadius:'6px',padding:'7px 10px'}}>
                      <div style={{width:'20px',height:'20px',borderRadius:'50%',background:`${cobalt}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:700,flexShrink:0}}>{r.init}</div>
                      <div style={{flex:1,minWidth:0,fontSize:'11px'}}>
                        <span style={{color:'rgba(255,255,255,0.5)'}}>{r.action}</span>
                      </div>
                      <div style={{width:'6px',height:'6px',borderRadius:'50%',background:r.c,flexShrink:0}}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card — booking */}
            <div className="f1" style={{position:'absolute',left:'0px',top:'calc(50% - 110px)',background:'rgba(6,12,28,0.92)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:'12px',padding:'14px 18px',minWidth:'175px',zIndex:5}}>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',marginBottom:'6px'}}>Booking sistem</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
                <span style={{color:'white',fontSize:'15px',fontWeight:700}}>24/7 aktiven</span>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80'}} className="dot-live"/>
              </div>
            </div>
            {/* Floating card — reviews */}
            <div className="f2" style={{position:'absolute',left:'10px',top:'calc(50% + 70px)',background:'rgba(6,12,28,0.92)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:'12px',padding:'14px 18px',minWidth:'175px',zIndex:5}}>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',marginBottom:'6px'}}>Google ocene</p>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b"><path d="M7 1l1.4 2.8 3.1.6-2.2 2.2.5 3.1L7 8.4l-2.8 1.3.5-3.1L2.5 4.4l3.1-.6z"/></svg>
                <span style={{color:'#f59e0b',fontSize:'13px',fontWeight:700}}>Samodejno</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZAKAJ CARBONIS — editorial 3 benefits ── */}
      <section id="kako-deluje" style={{background:'white',padding:'0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 32px 0'}}>
          <div style={{marginBottom:'56px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Zakaj Carbonis</p>
            <h2 style={{fontSize:'44px',fontWeight:800,lineHeight:1.12,letterSpacing:'-0.03em',maxWidth:'560px'}}>
              <span style={{color:'#172033',display:'block'}}>Pasivna baza strank.</span>
              <span style={{color:cobalt,display:'block'}}>Aktiviran prihodek.</span>
            </h2>
          </div>
        </div>
        {/* 3 editorial blocks — separated by vertical lines */}
        <div className="benefits-grid" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px 80px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',borderTop:'1px solid #E0E5ED'}}>
          {[
            {
              num:'01',
              title:'Stranke ki so bile zadovoljne se vrnejo',
              body:'V vaši bazi spi denar. Stranke ki so bile pri vas in 3+ mesece niso prišle nazaj — ne zato ker niso bile zadovoljne, ampak ker jih nihče ni poklical. Carbonis to naredi namesto vas, z osebnim sporočilom v pravem trenutku.',
              icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109-9" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/><path d="M3 8v4h4" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            },
            {
              num:'02',
              title:'Vsak klic sprejet, vsak termin potrjen',
              body:'Booking sistem in glasovni asistent poskrbita da nobeno povpraševanje ne ostane brez odgovora — niti med delovnim časom, niti zvečer. Vi delate. Sistem dela z vami.',
              icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke={cobalt} strokeWidth="1.5"/><path d="M7 2v4M17 2v4M3 10h18" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/></svg>
            },
            {
              num:'03',
              title:'Ugled ki ga gradijo vaše stranke',
              body:'Po vsaki storitvi stranka dobi prošnjo za oceno. Vaš Google profil raste organsko — brez vašega posredovanja. Novi kupci vas najdejo, preden se sploh odločijo kje bodo šli.',
              icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.8 5.6 6.2 1.2-4.5 4.4 1.1 6.2L12 16.6l-5.6 2.8 1.1-6.2L3 8.8l6.2-1.2z" stroke={cobalt} strokeWidth="1.5" strokeLinejoin="round"/></svg>
            },
          ].map((b,i,arr) => (
            <div
              key={b.num}
              className={i < arr.length-1 ? 'benefits-border-r' : ''}
              style={{padding:'48px 36px',borderRight:i<arr.length-1?'1px solid #E0E5ED':'none'}}
            >
              <div style={{width:'44px',height:'44px',background:'#EEF3FF',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'24px'}}>{b.icon}</div>
              <span style={{fontSize:'11px',fontWeight:700,color:cobalt,letterSpacing:'0.1em'}}>{b.num}</span>
              <h3 style={{fontSize:'19px',fontWeight:800,color:'#172033',lineHeight:1.3,margin:'12px 0 14px'}}>{b.title}</h3>
              <p style={{fontSize:'14px',color:'#5D687A',lineHeight:1.8}}>{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KAKO DELUJE — process + dashboard ── */}
      <section style={{background:'#F7F8FA',padding:'88px 0'}}>
        <div className="proc-wrap" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'56px',alignItems:'center'}}>
          <div style={{flex:'0 0 400px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Postavljeno v 24 urah</p>
            <h2 style={{fontSize:'38px',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'20px',color:'#172033'}}>
              Štirje koraki<br/>do <span style={{color:cobalt}}>prvih kontaktov.</span>
            </h2>
            <p style={{color:'#5D687A',fontSize:'15px',lineHeight:1.75,marginBottom:'36px'}}>Ni tehničnega znanja potrebno. Prinesete kar imate — seznam, Excel, ali karkoli drugega. V 7–14 dneh vidite prve odzive.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
              {[
                ['01','Poveste nam o svojih strankah','Prinesete kar imate — seznam, Excel, foto papirja. Uredimo za vas.'],
                ['02','Sistem se postavi za vas','V 24 urah je vse pripravljeno. Nobenih tehničnih znanj.'],
                ['03','Stare stranke se začnejo odzivati','V 7–14 dneh vidite prve odzive. Sistem sledi in ukrepa.'],
                ['04','Sistem dela naprej sam','Vi se fokusirate na vaše delo. Ostalo je naše.'],
              ].map(([num,title,desc],i,arr) => (
                <div key={num} style={{display:'flex',gap:'20px',paddingBottom:i<arr.length-1?'24px':'0',position:'relative'}}>
                  {i<arr.length-1 && <div style={{position:'absolute',left:'19px',top:'40px',width:'1px',height:'calc(100% - 16px)',background:'#E0E5ED'}}/>}
                  <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'white',border:`2px solid ${cobalt}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:800,color:cobalt,flexShrink:0,zIndex:1}}>{num}</div>
                  <div style={{paddingTop:'8px'}}>
                    <h4 style={{fontSize:'15px',fontWeight:700,color:'#172033',marginBottom:'4px'}}>{title}</h4>
                    <p style={{fontSize:'13.5px',color:'#5D687A',lineHeight:1.6}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{flex:1}}>
            <div style={{background:'white',borderRadius:'14px',boxShadow:'0 4px 6px -1px rgba(0,0,0,0.07),0 24px 60px -10px rgba(16,42,86,0.10)',overflow:'hidden',display:'flex',height:'430px',border:'1px solid #E0E5ED'}}>
              <div style={{width:'148px',background:navy,padding:'0',flexShrink:0}}>
                <div style={{padding:'16px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <span style={{color:'white',fontSize:'11px',fontWeight:700}}>Carbonis</span>
                </div>
                {(['Dashboard','Stranke','Kampanje','Ocene','Klici','Poročila','Nastavitve'] as string[]).map((label,i) => (
                  <div key={label} style={{padding:'8px 14px',fontSize:'12px',color:i===0?'white':'rgba(255,255,255,0.42)',background:i===0?'rgba(255,255,255,0.12)':'transparent',fontWeight:i===0?600:400,borderLeft:i===0?`2px solid ${cobalt}`:'2px solid transparent'}}>{label}</div>
                ))}
              </div>
              <div style={{flex:1,padding:'16px 18px',overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
                  <span style={{fontSize:'15px',fontWeight:700,color:'#172033'}}>Dashboard</span>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'11px',color:'#5D687A',background:'#F7F8FA',padding:'3px 8px',borderRadius:'5px',border:'1px solid #E0E5ED'}}>Moje podjetje ▾</span>
                    <div style={{width:'22px',height:'22px',borderRadius:'50%',background:cobalt,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:700}}>VP</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'12px'}}>
                  {[
                    {l:'Kontaktirane stranke',d:'Ta mesec',c:'#22c55e'},
                    {l:'Novih Google ocen',d:'Zbranih',c:'#f59e0b'},
                    {l:'Potrjeni termini',d:'Booking sistem',c:cobalt},
                  ].map(k => (
                    <div key={k.l} style={{background:'#F7F8FA',borderRadius:'8px',padding:'9px',border:'1px solid #E0E5ED'}}>
                      <div style={{color:'#94a3b8',fontSize:'8.5px',marginBottom:'6px'}}>{k.l}</div>
                      <div style={{color:'#172033',fontSize:'14px',fontWeight:800,marginBottom:'3px'}}>—</div>
                      <div style={{color:k.c,fontSize:'8.5px'}}>{k.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'8px'}}>
                  <div style={{background:'#F7F8FA',borderRadius:'8px',padding:'10px',border:'1px solid #E0E5ED'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                      <span style={{fontSize:'9.5px',fontWeight:600,color:'#334155'}}>Aktivnost strank</span>
                    </div>
                    <svg viewBox="0 0 200 65" style={{width:'100%'}}>
                      {[0,20,40,60].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#E0E5ED" strokeWidth="0.5"/>)}
                      <path d="M0 55 Q25 50 50 44 Q75 36 100 28 Q125 22 150 16 Q175 11 200 7" fill="none" stroke={cobalt} strokeWidth="1.5"/>
                      <path d="M0 55 Q25 50 50 44 Q75 36 100 28 Q125 22 150 16 Q175 11 200 7 L200 65 L0 65Z" fill="url(#mg2)"/>
                      <defs><linearGradient id="mg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={cobalt} stopOpacity="0.18"/><stop offset="100%" stopColor={cobalt} stopOpacity="0"/></linearGradient></defs>
                      {['Maj','Jun','Jul','Avg','Sep','Okt'].map((m,i) => <text key={m} x={i*40} y="63" fill="#94a3b8" fontSize="6.5" textAnchor="middle">{m}</text>)}
                    </svg>
                  </div>
                  <div style={{background:'#F7F8FA',borderRadius:'8px',padding:'10px',border:'1px solid #E0E5ED'}}>
                    <div style={{fontSize:'9.5px',fontWeight:600,color:'#334155',marginBottom:'8px'}}>Aktivni kanali</div>
                    {[['#4ade80','Reaktivacija'],['#356AE6','Ocene'],['#a78bfa','Booking'],['#94a3b8','Glas']].map(([c,l]) => (
                      <div key={l} style={{display:'flex',alignItems:'center',gap:'4px',marginBottom:'5px'}}>
                        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:c,flexShrink:0}}/>
                        <span style={{color:'#5D687A',fontSize:'8px',flex:1}}>{l}</span>
                        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80'}} className="dot-live"/>
                      </div>
                    ))}
                    <div style={{display:'flex',justifyContent:'center',marginTop:'8px'}}>
                      <svg viewBox="0 0 60 60" width="50" height="50">
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#E0E5ED" strokeWidth="10"/>
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#4ade80" strokeWidth="10" strokeDasharray="59 80" strokeDashoffset="-14"/>
                        <circle cx="30" cy="30" r="22" fill="none" stroke={cobalt} strokeWidth="10" strokeDasharray="37 102" strokeDashoffset="-73"/>
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#a78bfa" strokeWidth="10" strokeDasharray="23 116" strokeDashoffset="-110"/>
                        <text x="30" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#172033">—</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PANOGE ── */}
      <section id="panoge" style={{background:'white',padding:'88px 0'}}>
        <div className="industry-wrap" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'flex-start'}}>
          <div style={{flex:'0 0 260px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Prilagojeno vaši panogi</p>
            <h2 style={{fontSize:'32px',fontWeight:800,color:'#172033',lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:'14px'}}>Izberite svojo panogo</h2>
            <p style={{color:'#5D687A',fontSize:'14px',lineHeight:1.7,marginBottom:'24px'}}>Carbonis se prilagodi vaši branži — pravi timing, sporočila in pristop za vsako vrsto lokalnega podjetja.</p>
            <a href="#paketi" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:cobalt,fontSize:'14px',fontWeight:600,border:`1.5px solid ${cobalt}`,padding:'8px 18px',borderRadius:'8px'}}>Oglejte si pakete →</a>
          </div>
          <div style={{flex:1}}>
            <IndustrySelector />
          </div>
        </div>
      </section>

      {/* ── PAKETI ── */}
      <section id="paketi" style={{background:'#F7F8FA',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',marginBottom:'52px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>Transparentne cene</p>
            <h2 style={{fontSize:'38px',fontWeight:800,color:'#172033',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'16px'}}>Brez presenečenj. <span style={{color:cobalt}}>Brez skritih stroškov.</span></h2>
            <p style={{color:'#5D687A',fontSize:'16px'}}>Brez začetne postavitve. Starter in Growth: odpoveste kadarkoli.</p>
          </div>
          <div className="pkg-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',alignItems:'start'}}>
            {[
              {name:'STARTER',price:'149',badge:null,for:'Manjša podjetja ki želijo preveriti ali sistem deluje',features:['Reaktivacija starih strank (SMS)','Zbiranje Google ocen','Follow-up sekvence','Mini poročila'],missing:['Voice klici','GEO vidljivost','Booking sistem']},
              {name:'GROWTH',price:'249',badge:'Najpopularnejši',for:'Podjetja ki želijo rast na vseh kanalih',features:['Vse iz Starter','Uvoz baze strank','GEO/AI vidljivost','Booking sistem','Polni dashboard','AI odgovori na ocene'],missing:['Voice klici (outbound)']},
              {name:'PRO',price:'349',badge:'12-mes. pogodba',for:'Podjetja ki hočejo maksimalne rezultate',features:['Vse iz Growth','Glasovni asistent 24/7','Glasovni klici starim strankam','Dedicirani telefon (SI/HR)','Prioritetna podpora'],missing:[]},
            ].map(pkg => (
              <div key={pkg.name} className={pkg.name==='GROWTH'?'pkg-mid':''} style={{background:'white',borderRadius:'14px',padding:'32px',border:pkg.name==='GROWTH'?`2px solid ${cobalt}`:'1px solid #E0E5ED',boxShadow:pkg.name==='GROWTH'?`0 4px 20px rgba(53,106,230,0.12)`:'0 1px 4px rgba(0,0,0,0.05)',position:'relative',transform:pkg.name==='GROWTH'?'scale(1.03)':'none'}}>
                {pkg.badge && <div style={{position:'absolute',top:'-13px',left:'50%',transform:'translateX(-50%)',background:pkg.name==='GROWTH'?cobalt:'#5D687A',color:'white',fontSize:'11px',fontWeight:700,padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>{pkg.badge}</div>}
                <p style={{fontWeight:800,fontSize:'12px',color:'#5D687A',letterSpacing:'0.08em',marginBottom:'10px'}}>{pkg.name}</p>
                <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'8px'}}>
                  <span style={{fontSize:'40px',fontWeight:800,color:navy}}>{pkg.price} €</span>
                  <span style={{color:'#5D687A',fontSize:'14px'}}>/mes</span>
                </div>
                <p style={{fontSize:'13px',color:'#5D687A',marginBottom:'24px',lineHeight:1.5}}>{pkg.for}</p>
                <div style={{borderTop:'1px solid #E0E5ED',paddingTop:'18px',display:'flex',flexDirection:'column',gap:'9px'}}>
                  {pkg.features.map(f => (
                    <div key={f} style={{display:'flex',gap:'8px',fontSize:'13px',color:'#374151',alignItems:'flex-start'}}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:'1px'}}><circle cx="8" cy="8" r="8" fill="#EEF3FF"/><path d="M5 8l2 2 4-4" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      {f}
                    </div>
                  ))}
                  {pkg.missing.map(f => (
                    <div key={f} style={{display:'flex',gap:'8px',fontSize:'13px',color:'#cbd5e1',alignItems:'flex-start'}}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0,marginTop:'1px'}}><circle cx="7" cy="7" r="7" fill="#F7F8FA"/><path d="M5 5l4 4M9 5l-4 4" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/register" style={{display:'block',textAlign:'center',marginTop:'24px',padding:'12px',borderRadius:'8px',background:pkg.name==='GROWTH'?cobalt:navy,color:'white',fontWeight:700,fontSize:'14px'}}>
                  Začni s {pkg.name.charAt(0)+pkg.name.slice(1).toLowerCase()}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{background:'white',padding:'88px 0'}}>
        <div className="faq-wrap" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'flex-start'}}>
          <div style={{flex:'0 0 280px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>FAQ</p>
            <h2 style={{fontSize:'32px',fontWeight:800,color:'#172033',lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:'14px'}}>Pogosta vprašanja</h2>
            <p style={{color:'#5D687A',fontSize:'14px',lineHeight:1.7}}>Niste našli odgovora? Pogovorite se z Vero — odgovori takoj.</p>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'2px'}}>
            {[
              ['Kaj če nimam urejene baze strank?','Ni problema. Pošljite kar imate — Excel, seznam, foto papirja. Uredimo za vas brez doplačila.'],
              ['Kako hitro vidim prve rezultate?','Prve odzive strank tipično vidite v 7–14 dneh od zagona. Odvisno od panoge in velikosti baze.'],
              ['Ali bodo moje stranke vedele da gre za sistem?','Ne. Sporočila gredo z vašim imenom in vašo telefonsko številko. Za stranko ste to vi.'],
              ['Kaj če odpovem?','Starter in Growth: odpoveste kadarkoli brez kazni. Pro: 12-mesečna pogodba.'],
              ['Ali so moji podatki varni?','Vsi podatki shranjeni na EU strežnikih. GDPR skladno.'],
              ['Kako poteka postavitev?','Izpolnite kratek vprašalnik (10 min). V 24 urah je sistem pripravljen. Nobenih tehničnih znanj.'],
            ].map(([q,a]) => (
              <details key={q} style={{background:'#F7F8FA',borderRadius:'10px',border:'1px solid #E0E5ED',padding:'18px 22px'}}>
                <summary style={{fontWeight:600,fontSize:'15px',color:'#172033',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'16px'}}>
                  {q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M4 6l4 4 4-4" stroke={cobalt} strokeWidth="1.6" strokeLinecap="round"/></svg>
                </summary>
                <p style={{marginTop:'12px',fontSize:'14px',color:'#5D687A',lineHeight:1.65}}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background:navy,padding:'72px 0'}}>
        <div className="cta-wrap" style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'40px',flexWrap:'wrap'}}>
          <div>
            <p style={{color:'#7fa8e0',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'12px'}}>Pripravljeni začeti?</p>
            <h2 style={{fontSize:'36px',fontWeight:800,color:'white',lineHeight:1.2,letterSpacing:'-0.02em'}}>Preverite koliko strank<br/>spi v vaši bazi.</h2>
          </div>
          <div>
            <p style={{color:'#8fa8c8',fontSize:'14px',lineHeight:1.65,marginBottom:'20px',maxWidth:'280px'}}>Brezplačen pogovor o vaši situaciji. Povemo kaj vidimo in kaj bi bilo smiselno storiti.</p>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:cobalt,color:'white',fontSize:'15px',fontWeight:700,padding:'13px 28px',borderRadius:'9px'}}>Začnite brezplačno →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="about" style={{background:'#0d1a2e',padding:'52px 0 26px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div className="footer-top" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'40px',flexWrap:'wrap',gap:'20px'}}>
            <Link href="/"><img src="/carbonis-logo-dark.png" alt="Carbonis" style={{height:'48px',width:'auto'}}/></Link>
            <nav style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
              {[['Kako deluje','#kako-deluje'],['Panoge','#panoge'],['Paketi','#paketi'],['FAQ','#faq'],['Prijava','/login']].map(([l,h]) => (
                <a key={l} href={h} style={{color:'#5D687A',fontSize:'13px'}}>{l}</a>
              ))}
            </nav>
            <p style={{color:'#5D687A',fontSize:'12px'}}>info@carbonis.eu</p>
          </div>
          <div className="footer-bot" style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
            <p style={{color:'#334155',fontSize:'12px'}}>© 2026 Carbonis. Vsi podatki na EU strežnikih · GDPR skladno.</p>
            <div style={{display:'flex',gap:'18px'}}>
              <a href="/politika-zasebnosti" style={{color:'#334155',fontSize:'12px'}}>Politika zasebnosti</a>
              <a href="/pogoji-uporabe" style={{color:'#334155',fontSize:'12px'}}>Pogoji uporabe</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
