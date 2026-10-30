import Link from 'next/link'
import IndustrySelector from './components/IndustrySelector'

const navy = '#102A56'
const cobalt = '#356AE6'
const bg = '#F7F8FA'
const text = '#172033'
const muted = '#5D687A'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', color: text }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none}
        button{cursor:pointer;border:none;background:none}
        h1,h2{font-family:'var(--font-dm-serif), Georgia, serif'}
        .serif{font-family:var(--font-dm-serif),Georgia,serif}
        .nl{color:${muted};font-size:14px;transition:color .15s}
        .nl:hover{color:${navy}}
        details>summary{list-style:none;cursor:pointer}
        details>summary::-webkit-details-marker{display:none}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes breathe{0%,100%{r:4}50%{r:6}}
        @keyframes flow{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}
        .cta-primary{background:${cobalt};color:white;font-size:15px;font-weight:600;padding:13px 28px;border-radius:9px;display:inline-flex;align-items:center;gap:7px;transition:background .18s}
        .cta-primary:hover{background:#2856cc}
        .cta-ghost{color:white;font-size:14px;font-weight:500;padding:13px 24px;border-radius:9px;border:1.5px solid rgba(255,255,255,0.22);display:inline-flex;align-items:center;gap:6px;transition:border-color .18s}
        .cta-ghost:hover{border-color:rgba(255,255,255,0.5)}
        @media(max-width:960px){
          .hero-inner{flex-direction:column!important;padding:56px 20px 64px!important;gap:48px!important}
          .hero-left{flex:unset!important;max-width:100%!important}
          .hero-right{width:100%!important;height:320px!important}
          .three-col{grid-template-columns:1fr 1fr!important}
          .proc-wrap{flex-direction:column!important}
          .industry-wrap{flex-direction:column!important;gap:36px!important}
          .faq-wrap{flex-direction:column!important;gap:32px!important}
          .cta-wrap{flex-direction:column!important;text-align:center}
          .pkg-grid{grid-template-columns:1fr!important}
          .pkg-mid{transform:none!important}
          .footer-top{flex-direction:column!important;gap:20px!important}
          .footer-bot{flex-direction:column!important;gap:12px!important;align-items:flex-start!important}
        }
        @media(max-width:600px){
          .nav-links{display:none!important}
          .hero-ctas{flex-direction:column!important;align-items:flex-start!important}
          .three-col{grid-template-columns:1fr!important}
          .stats-strip{flex-direction:column!important;gap:0!important}
          .stats-item{border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.1)!important;padding:24px 0!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'white',borderBottom:'1px solid #E0E5ED',boxShadow:'0 1px 8px rgba(0,0,0,0.04)'}}>
        <div style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/">
            <span style={{fontFamily:'var(--font-dm-serif),Georgia,serif',fontSize:'22px',fontWeight:400,color:navy,letterSpacing:'-0.01em'}}>carbonis</span>
          </Link>
          <div className="nav-links" style={{display:'flex',gap:'32px',alignItems:'center'}}>
            <a href="#kako-deluje" className="nl">Kako deluje</a>
            <a href="#panoge" className="nl">Panoge</a>
            <a href="#paketi" className="nl">Paketi</a>
            <a href="#faq" className="nl">FAQ</a>
          </div>
          <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
            <Link href="/login" style={{color:muted,fontSize:'14px',fontWeight:500}}>Prijava</Link>
            <Link href="/register" className="cta-primary" style={{fontSize:'14px',padding:'9px 20px',borderRadius:'8px'}}>Začnite brezplačno</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{background:`linear-gradient(150deg,#06101e 0%,#0d1d3b 55%,#071525 100%)`,minHeight:'680px',overflow:'hidden',display:'flex',alignItems:'center',position:'relative'}}>
        {/* subtle grid texture */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.04}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        <div className="hero-inner" style={{maxWidth:'1160px',margin:'0 auto',padding:'88px 32px 96px',display:'flex',alignItems:'center',gap:'64px',width:'100%',position:'relative',zIndex:2}}>

          {/* Left */}
          <div className="hero-left" style={{flex:'0 0 520px',maxWidth:'520px'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'7px',background:'rgba(53,106,230,0.15)',border:'1px solid rgba(53,106,230,0.25)',borderRadius:'20px',padding:'5px 14px',marginBottom:'28px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'pulse 2s infinite'}}/>
              <span style={{color:'#7fa8e0',fontSize:'12px',fontWeight:500}}>Za lokalna podjetja · SLO &amp; HR</span>
            </div>

            <h1 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'54px',fontWeight:400,lineHeight:1.1,
              letterSpacing:'-0.02em',marginBottom:'24px',
              color:'white',
            }}>
              Vaše stranke<br/>
              <span style={{color:cobalt}}>se vračajo same.</span>
            </h1>

            <p style={{color:'#8fa8c8',fontSize:'16px',lineHeight:1.8,marginBottom:'36px',maxWidth:'440px'}}>
              Carbonis reaktivira stare stranke, zbira Google ocene in zapolni urnik — brez klicanja, brez ročnega dela, brez tehničnega znanja.
            </p>

            <div className="hero-ctas" style={{display:'flex',gap:'12px',marginBottom:'44px',flexWrap:'wrap'}}>
              <a href="#panoge" className="cta-primary">Preverite za vaše podjetje</a>
              <a href="#kako-deluje" className="cta-ghost">Kako deluje ↓</a>
            </div>

            <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
              {['Aktivno v 24 urah','GDPR · EU strežniki','Brez tehničnega znanja'].map(l => (
                <div key={l} style={{display:'flex',alignItems:'center',gap:'7px'}}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10 11.5 4" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <span style={{color:'#7fa8e0',fontSize:'13px'}}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Customer Network SVG */}
          <div className="hero-right" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',height:'480px',position:'relative'}}>
            <svg viewBox="0 0 420 380" width="420" height="380" style={{maxWidth:'100%',overflow:'visible'}}>
              <defs>
                <radialGradient id="cglow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={cobalt} stopOpacity="0.25"/>
                  <stop offset="100%" stopColor={cobalt} stopOpacity="0"/>
                </radialGradient>
                <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
                <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
                {/* animated dash offset */}
                <style>{`
                  .flow-line{stroke-dasharray:8 6;animation:flow 2s linear infinite}
                  .flow-line-2{stroke-dasharray:8 6;animation:flow 2.5s linear infinite}
                  .flow-line-3{stroke-dasharray:8 6;animation:flow 3s linear infinite}
                  .node-pulse{animation:breathe 2s ease-in-out infinite}
                `}</style>
              </defs>

              {/* Background glow */}
              <ellipse cx="210" cy="190" rx="180" ry="160" fill="url(#cglow)" filter="url(#blur8)"/>

              {/* Center — Carbonis */}
              <circle cx="210" cy="190" r="44" fill={`${cobalt}18`} stroke={cobalt} strokeWidth="1.5"/>
              <circle cx="210" cy="190" r="36" fill={cobalt}/>
              <text x="210" y="186" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="sans-serif">carbonis</text>
              <text x="210" y="200" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="sans-serif">AI pomočnik</text>
              {/* outer ring */}
              <circle cx="210" cy="190" r="56" fill="none" stroke={`${cobalt}35`} strokeWidth="1" strokeDasharray="3 4"/>

              {/* Active customers (green = returning) */}
              {[
                {cx:90,cy:70,label:'Marija K.',sub:'vrača se',color:'#4ade80',active:true},
                {cx:350,cy:85,label:'Avtoservis',sub:'ocena ★★★★★',color:'#4ade80',active:true},
                {cx:60,cy:270,label:'Mitja P.',sub:'termin',color:'#4ade80',active:true},
                {cx:355,cy:290,label:'Salon Lana',sub:'reaktivacija',color:'#4ade80',active:true},
              ].map((n,i) => (
                <g key={i}>
                  {/* Connection line — animated */}
                  <line
                    x1={n.cx} y1={n.cy} x2="210" y2="190"
                    stroke="#4ade80" strokeWidth="1.2" strokeOpacity="0.4"
                    className="flow-line"
                    style={{animationDelay:`${i*0.4}s`}}
                  />
                  {/* Node glow */}
                  <circle cx={n.cx} cy={n.cy} r="18" fill="#4ade8015" filter="url(#blur4)"/>
                  <circle cx={n.cx} cy={n.cy} r="14" fill="#081524" stroke="#4ade80" strokeWidth="1.5"/>
                  <circle cx={n.cx} cy={n.cy} r="4" fill="#4ade80" className="node-pulse" style={{animationDelay:`${i*0.5}s`}}/>
                  <text x={n.cx} y={n.cy+26} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="sans-serif">{n.label}</text>
                  <text x={n.cx} y={n.cy+37} textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="sans-serif">{n.sub}</text>
                </g>
              ))}

              {/* Sleeping customers (gray = not yet reactivated) */}
              {[
                {cx:160,cy:50,label:'Franc L.',sub:'spi...'},
                {cx:270,cy:310,label:'Tina M.',sub:'3 mes.'},
              ].map((n,i) => (
                <g key={i}>
                  <line x1={n.cx} y1={n.cy} x2="210" y2="190" stroke="#4a5568" strokeWidth="1" strokeDasharray="3 5" strokeOpacity="0.5"/>
                  <circle cx={n.cx} cy={n.cy} r="13" fill="#081524" stroke="#4a5568" strokeWidth="1.2"/>
                  <circle cx={n.cx} cy={n.cy} r="3" fill="#4a5568"/>
                  <text x={n.cx} y={n.cy+23} textAnchor="middle" fill="#4a5568" fontSize="8" fontFamily="sans-serif">{n.label}</text>
                  <text x={n.cx} y={n.cy+32} textAnchor="middle" fill="#4a5568" fontSize="7.5" fontFamily="sans-serif">{n.sub}</text>
                </g>
              ))}

              {/* Legend */}
              <g transform="translate(100,340)">
                <circle cx="0" cy="0" r="5" fill="#4ade80"/>
                <text x="10" y="4" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="sans-serif">Aktivirane</text>
                <circle cx="80" cy="0" r="5" fill="#4a5568"/>
                <text x="90" y="4" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="sans-serif">Speče</text>
              </g>
            </svg>

            {/* Floating stat cards */}
            <div style={{position:'absolute',top:'10px',left:'10px',background:'rgba(6,12,28,0.88)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:'12px',padding:'12px 16px',minWidth:'148px'}}>
              <p style={{color:'rgba(255,255,255,0.45)',fontSize:'9.5px',marginBottom:'5px'}}>Kontaktiranih danes</p>
              <p style={{color:'#4ade80',fontSize:'18px',fontWeight:700,letterSpacing:'-0.02em'}}>24 stranke</p>
            </div>
            <div style={{position:'absolute',bottom:'48px',right:'10px',background:'rgba(6,12,28,0.88)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:'12px',padding:'12px 16px',minWidth:'148px'}}>
              <p style={{color:'rgba(255,255,255,0.45)',fontSize:'9.5px',marginBottom:'5px'}}>Nov termin · 16:30</p>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'pulse 2s infinite'}}/>
                <p style={{color:'white',fontSize:'13px',fontWeight:600}}>Booking sistem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{background:navy,padding:'0'}}>
        <div style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px'}}>
          <div className="stats-strip" style={{display:'flex',alignItems:'stretch',gap:'0'}}>
            {[
              {num:'6',unit:'panog',desc:'avtoservisi, saloni, fitnes, gostinci, nepremičnine, ordinacije'},
              {num:'24h',unit:'postavitev',desc:'od podpisa do prvih poslanih sporočil'},
              {num:'SLO',unit:'+ HR',desc:'lokalni trgi, lokalni jeziki, EU zakonodaja'},
              {num:'GDPR',unit:'skladno',desc:'podatki na EU strežnikih, Zakon o varstvu podatkov'},
            ].map((s,i) => (
              <div
                key={i}
                className="stats-item"
                style={{
                  flex:1,padding:'36px 32px',
                  borderRight:i<3?'1px solid rgba(255,255,255,0.1)':'none',
                }}
              >
                <div style={{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'6px'}}>
                  <span style={{
                    fontFamily:'var(--font-dm-serif),Georgia,serif',
                    fontSize:'38px',fontWeight:400,color:'white',lineHeight:1,
                  }}>{s.num}</span>
                  <span style={{color:cobalt,fontSize:'16px',fontWeight:600}}>{s.unit}</span>
                </div>
                <p style={{color:'rgba(255,255,255,0.45)',fontSize:'12px',lineHeight:1.5}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZAKAJ CARBONIS ── */}
      <section id="kako-deluje" style={{background:'white',padding:'96px 0 0'}}>
        <div style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px 0'}}>
          <div style={{maxWidth:'540px',marginBottom:'64px'}}>
            <p style={{color:cobalt,fontSize:'12px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>Zakaj Carbonis</p>
            <h2 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'44px',fontWeight:400,lineHeight:1.12,
              letterSpacing:'-0.01em',color:text,
            }}>
              Pasivna baza strank.<br/>
              <span style={{color:cobalt}}>Aktiviran prihodek.</span>
            </h2>
          </div>
        </div>
        <div className="three-col" style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px 96px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',borderTop:'1px solid #E0E5ED'}}>
          {[
            {
              title:'Stranke ki so bile zadovoljne se vrnejo',
              body:'V vaši bazi spi denar. Stranke ki so bile pri vas in 3+ mesece niso prišle nazaj — ne zato ker niso bile zadovoljne, ampak ker jih nihče ni poklical. Carbonis to naredi namesto vas, z osebnim sporočilom v pravem trenutku.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109-9" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/><path d="M3 8v4h4" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            },
            {
              title:'Vsak klic sprejet, vsak termin potrjen',
              body:'Booking sistem in glasovni asistent poskrbita da nobeno povpraševanje ne ostane brez odgovora — niti med delom, niti zvečer. Vi delate. Sistem dela z vami.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke={cobalt} strokeWidth="1.5"/><path d="M7 2v4M17 2v4M3 10h18" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/></svg>
            },
            {
              title:'Ugled ki ga gradijo vaše stranke',
              body:'Po vsaki storitvi stranka dobi prošnjo za oceno. Vaš Google profil raste organsko — brez vašega posredovanja. Novi kupci vas najdejo, preden se sploh odločijo.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.8 5.6 6.2 1.2-4.5 4.4 1.1 6.2L12 16.6l-5.6 2.8 1.1-6.2L3 8.8l6.2-1.2z" stroke={cobalt} strokeWidth="1.5" strokeLinejoin="round"/></svg>
            },
          ].map((b,i,arr) => (
            <div key={i} style={{padding:'52px 36px',borderRight:i<arr.length-1?'1px solid #E0E5ED':'none'}}>
              <div style={{width:'48px',height:'48px',background:'#EEF3FF',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'28px'}}>{b.icon}</div>
              <h3 style={{fontSize:'19px',fontWeight:700,color:text,lineHeight:1.3,marginBottom:'14px',letterSpacing:'-0.01em'}}>{b.title}</h3>
              <p style={{fontSize:'14px',color:muted,lineHeight:1.85}}>{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KAKO DELUJE — 4 koraki ── */}
      <section style={{background:bg,padding:'88px 0'}}>
        <div className="proc-wrap" style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'72px',alignItems:'center'}}>
          <div style={{flex:'0 0 400px'}}>
            <p style={{color:cobalt,fontSize:'12px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>Postavljeno v 24 urah</p>
            <h2 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'38px',fontWeight:400,lineHeight:1.15,
              letterSpacing:'-0.01em',marginBottom:'20px',color:text,
            }}>Štirje koraki<br/>do prvih kontaktov.</h2>
            <p style={{color:muted,fontSize:'15px',lineHeight:1.8,marginBottom:'36px'}}>Ni tehničnega znanja potrebno. Prinesete kar imate — seznam, Excel, ali karkoli drugega. V 7–14 dneh vidite prve odzive.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
              {[
                ['01','Poveste nam o svojih strankah','Prinesete kar imate — seznam, Excel, foto papirja. Uredimo za vas.'],
                ['02','Sistem se postavi za vas','V 24 urah je vse pripravljeno. Nobenih tehničnih znanj.'],
                ['03','Stare stranke se začnejo odzivati','V 7–14 dneh vidite prve odzive. Sistem sledi in ukrepa.'],
                ['04','Sistem dela naprej sam','Vi se fokusirate na vaše delo. Ostalo je naše.'],
              ].map(([num,title,desc],i,arr) => (
                <div key={num} style={{display:'flex',gap:'20px',paddingBottom:i<arr.length-1?'26px':'0',position:'relative'}}>
                  {i<arr.length-1 && <div style={{position:'absolute',left:'19px',top:'40px',width:'1px',height:'calc(100% - 16px)',background:'#E0E5ED'}}/>}
                  <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'white',border:`2px solid ${cobalt}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:cobalt,flexShrink:0,zIndex:1}}>{num}</div>
                  <div style={{paddingTop:'8px'}}>
                    <h4 style={{fontSize:'15px',fontWeight:600,color:text,marginBottom:'4px'}}>{title}</h4>
                    <p style={{fontSize:'13.5px',color:muted,lineHeight:1.65}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: 3-channel activation infographic */}
          <div style={{flex:1}}>
            <div style={{background:'white',borderRadius:'16px',boxShadow:'0 4px 6px -1px rgba(0,0,0,0.06),0 20px 50px -10px rgba(16,42,86,0.09)',overflow:'hidden',border:'1px solid #E0E5ED'}}>
              {/* Header */}
              <div style={{padding:'14px 20px',borderBottom:'1px solid #E0E5ED',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',fontWeight:700,color:text}}>Carbonis · Dashboard</span>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#4ade80',animation:'pulse 2s infinite'}}/>
                  <span style={{fontSize:'11px',color:muted}}>Aktivno</span>
                </div>
              </div>
              {/* Channel cards */}
              <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:'10px'}}>
                {[
                  {label:'Reaktivacija strank',sublabel:'SMS · Email · WhatsApp',icon:'↩',color:'#4ade80',bar:72},
                  {label:'Google ocene',sublabel:'Po vsakem obisku',icon:'★',color:'#f59e0b',bar:89},
                  {label:'Booking sistem',sublabel:'24/7 naročanje',icon:'📅',color:cobalt,bar:95},
                ].map((ch,i) => (
                  <div key={i} style={{background:bg,borderRadius:'10px',padding:'14px 16px',border:'1px solid #E0E5ED'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <span style={{fontSize:'14px'}}>{ch.icon}</span>
                        <div>
                          <p style={{fontSize:'13px',fontWeight:600,color:text}}>{ch.label}</p>
                          <p style={{fontSize:'11px',color:muted}}>{ch.sublabel}</p>
                        </div>
                      </div>
                      <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80',animation:'pulse 2s infinite'}}/>
                    </div>
                    <div style={{background:'#E0E5ED',borderRadius:'4px',height:'4px',overflow:'hidden'}}>
                      <div style={{width:`${ch.bar}%`,height:'100%',background:ch.color,borderRadius:'4px'}}/>
                    </div>
                    <p style={{fontSize:'10px',color:muted,marginTop:'5px',textAlign:'right'}}>{ch.bar}% odzivnost</p>
                  </div>
                ))}
              </div>
              {/* Recent activity */}
              <div style={{padding:'0 20px 16px',borderTop:'1px solid #E0E5ED',paddingTop:'14px'}}>
                <p style={{fontSize:'11px',fontWeight:600,color:muted,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'8px'}}>Zadnja aktivnost</p>
                {[
                  {dot:'#4ade80',text:'Marija K. se je naročila za termin'},
                  {dot:'#f59e0b',text:'Avtoservis Novak dobil novo oceno ★★★★★'},
                  {dot:cobalt,text:'Franc L. odgovoril na reaktivacijo'},
                ].map((r,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 0'}}>
                    <div style={{width:'6px',height:'6px',borderRadius:'50%',background:r.dot,flexShrink:0}}/>
                    <span style={{fontSize:'12px',color:muted}}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PANOGE ── */}
      <section id="panoge" style={{background:'white',padding:'88px 0'}}>
        <div className="industry-wrap" style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'flex-start'}}>
          <div style={{flex:'0 0 240px',position:'sticky',top:'80px'}}>
            <p style={{color:cobalt,fontSize:'12px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>Prilagojeno vaši panogi</p>
            <h2 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'32px',fontWeight:400,color:text,lineHeight:1.2,
              letterSpacing:'-0.01em',marginBottom:'16px',
            }}>Izberite svojo panogo</h2>
            <p style={{color:muted,fontSize:'14px',lineHeight:1.75,marginBottom:'24px'}}>Carbonis se prilagodi vaši branži — pravi timing, sporočila in pristop za vsako vrsto lokalnega podjetja.</p>
            <a href="#paketi" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:cobalt,fontSize:'14px',fontWeight:600,border:`1.5px solid ${cobalt}`,padding:'9px 18px',borderRadius:'8px',transition:'background .15s'}}>Oglejte si pakete →</a>
          </div>
          <div style={{flex:1}}>
            <IndustrySelector />
          </div>
        </div>
      </section>

      {/* ── PAKETI ── */}
      <section id="paketi" style={{background:bg,padding:'88px 0'}}>
        <div style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',marginBottom:'56px'}}>
            <p style={{color:cobalt,fontSize:'12px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'14px'}}>Transparentne cene</p>
            <h2 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'40px',fontWeight:400,color:text,
              lineHeight:1.12,letterSpacing:'-0.01em',marginBottom:'16px',
            }}>Brez presenečenj. <span style={{color:cobalt}}>Brez skritih stroškov.</span></h2>
            <p style={{color:muted,fontSize:'16px'}}>Brez začetne postavitve. Starter in Growth: odpoveste kadarkoli.</p>
          </div>
          <div className="pkg-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',alignItems:'start'}}>
            {[
              {name:'STARTER',price:'149',badge:null,for:'Manjša podjetja ki želijo preveriti ali sistem deluje',features:['Reaktivacija starih strank (SMS)','Zbiranje Google ocen','Follow-up sekvence','Mini poročila'],missing:['Voice klici','GEO vidljivost','Booking sistem']},
              {name:'GROWTH',price:'249',badge:'Najpopularnejši',for:'Podjetja ki želijo rast na vseh kanalih',features:['Vse iz Starter','Uvoz baze strank','GEO/AI vidljivost','Booking sistem','Polni dashboard','AI odgovori na ocene'],missing:['Voice klici (outbound)']},
              {name:'PRO',price:'349',badge:'12-mes. pogodba',for:'Podjetja ki hočejo maksimalne rezultate',features:['Vse iz Growth','Glasovni asistent 24/7','Glasovni klici starim strankam','Dedicirani telefon (SI/HR)','Prioritetna podpora'],missing:[]},
            ].map(pkg => (
              <div
                key={pkg.name}
                className={pkg.name==='GROWTH'?'pkg-mid':''}
                style={{
                  background:'white',borderRadius:'16px',padding:'32px',
                  border:pkg.name==='GROWTH'?`2px solid ${cobalt}`:'1px solid #E0E5ED',
                  boxShadow:pkg.name==='GROWTH'?`0 8px 32px rgba(53,106,230,0.13)`:'0 1px 4px rgba(0,0,0,0.05)',
                  position:'relative',
                  transform:pkg.name==='GROWTH'?'scale(1.03)':'none',
                }}
              >
                {pkg.badge && (
                  <div style={{position:'absolute',top:'-13px',left:'50%',transform:'translateX(-50%)',background:pkg.name==='GROWTH'?cobalt:'#5D687A',color:'white',fontSize:'11px',fontWeight:700,padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>{pkg.badge}</div>
                )}
                <p style={{fontWeight:700,fontSize:'11px',color:muted,letterSpacing:'0.1em',marginBottom:'12px'}}>{pkg.name}</p>
                <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'8px'}}>
                  <span style={{
                    fontFamily:'var(--font-dm-serif),Georgia,serif',
                    fontSize:'44px',fontWeight:400,color:navy,letterSpacing:'-0.02em',
                  }}>{pkg.price} €</span>
                  <span style={{color:muted,fontSize:'14px'}}>/mes</span>
                </div>
                <p style={{fontSize:'13px',color:muted,marginBottom:'24px',lineHeight:1.55}}>{pkg.for}</p>
                <div style={{borderTop:'1px solid #E0E5ED',paddingTop:'20px',display:'flex',flexDirection:'column',gap:'10px'}}>
                  {pkg.features.map(f => (
                    <div key={f} style={{display:'flex',gap:'8px',fontSize:'13px',color:'#374151',alignItems:'flex-start'}}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:'2px'}}><circle cx="8" cy="8" r="8" fill="#EEF3FF"/><path d="M5 8l2 2 4-4" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      {f}
                    </div>
                  ))}
                  {pkg.missing.map(f => (
                    <div key={f} style={{display:'flex',gap:'8px',fontSize:'13px',color:'#cbd5e1',alignItems:'flex-start'}}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0,marginTop:'2px'}}><circle cx="7" cy="7" r="7" fill="#F7F8FA"/><path d="M5 5l4 4M9 5l-4 4" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/register" style={{display:'block',textAlign:'center',marginTop:'24px',padding:'13px',borderRadius:'9px',background:pkg.name==='GROWTH'?cobalt:navy,color:'white',fontWeight:600,fontSize:'14px',fontFamily:'var(--font-inter),sans-serif',transition:'opacity .15s'}}>
                  Začni s {pkg.name.charAt(0)+pkg.name.slice(1).toLowerCase()}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{background:'white',padding:'88px 0'}}>
        <div className="faq-wrap" style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'flex-start'}}>
          <div style={{flex:'0 0 260px'}}>
            <p style={{color:cobalt,fontSize:'12px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'16px'}}>FAQ</p>
            <h2 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'32px',fontWeight:400,color:text,lineHeight:1.2,
              letterSpacing:'-0.01em',marginBottom:'14px',
            }}>Pogosta vprašanja</h2>
            <p style={{color:muted,fontSize:'14px',lineHeight:1.75}}>Niste našli odgovora? Pogovorite se z Vero — odgovori takoj.</p>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'3px'}}>
            {[
              ['Kaj če nimam urejene baze strank?','Ni problema. Pošljite kar imate — Excel, seznam, foto papirja. Uredimo za vas brez doplačila.'],
              ['Kako hitro vidim prve rezultate?','Prve odzive strank tipično vidite v 7–14 dneh od zagona. Odvisno od panoge in velikosti baze.'],
              ['Ali bodo moje stranke vedele da gre za sistem?','Ne. Sporočila gredo z vašim imenom in vašo telefonsko številko. Za stranko ste to vi.'],
              ['Kaj če odpovem?','Starter in Growth: odpoveste kadarkoli brez kazni. Pro: 12-mesečna pogodba.'],
              ['Ali so moji podatki varni?','Vsi podatki shranjeni na EU strežnikih. GDPR skladno.'],
              ['Kako poteka postavitev?','Izpolnite kratek vprašalnik (10 min). V 24 urah je sistem pripravljen. Nobenih tehničnih znanj.'],
            ].map(([q,a]) => (
              <details key={q} style={{background:bg,borderRadius:'10px',border:'1px solid #E0E5ED',padding:'18px 22px'}}>
                <summary style={{fontWeight:600,fontSize:'15px',color:text,display:'flex',justifyContent:'space-between',alignItems:'center',gap:'16px'}}>
                  {q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M4 6l4 4 4-4" stroke={cobalt} strokeWidth="1.6" strokeLinecap="round"/></svg>
                </summary>
                <p style={{marginTop:'12px',fontSize:'14px',color:muted,lineHeight:1.7}}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background:navy,padding:'80px 0'}}>
        <div className="cta-wrap" style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'48px',flexWrap:'wrap'}}>
          <div>
            <p style={{color:'#7fa8e0',fontSize:'12px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'14px'}}>Pripravljeni začeti?</p>
            <h2 style={{
              fontFamily:'var(--font-dm-serif),Georgia,serif',
              fontSize:'40px',fontWeight:400,color:'white',lineHeight:1.15,
              letterSpacing:'-0.01em',
            }}>Preverite koliko strank<br/>spi v vaši bazi.</h2>
          </div>
          <div style={{flexShrink:0}}>
            <p style={{color:'#8fa8c8',fontSize:'14px',lineHeight:1.75,marginBottom:'20px',maxWidth:'260px'}}>Brezplačen pogovor o vaši situaciji. Povemo kaj vidimo in kaj bi bilo smiselno storiti.</p>
            <Link href="/register" className="cta-primary" style={{fontSize:'15px',padding:'14px 30px'}}>Začnite brezplačno →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:'#0a1628',padding:'52px 0 28px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1160px',margin:'0 auto',padding:'0 32px'}}>
          <div className="footer-top" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'40px',flexWrap:'wrap',gap:'20px'}}>
            <Link href="/">
              <span style={{fontFamily:'var(--font-dm-serif),Georgia,serif',fontSize:'20px',fontWeight:400,color:'white',opacity:0.9}}>carbonis</span>
            </Link>
            <nav style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
              {[['Kako deluje','#kako-deluje'],['Panoge','#panoge'],['Paketi','#paketi'],['FAQ','#faq'],['Prijava','/login']].map(([l,h]) => (
                <a key={l} href={h} style={{color:'#4a5568',fontSize:'13px'}}>{l}</a>
              ))}
            </nav>
            <p style={{color:'#4a5568',fontSize:'12px'}}>info@carbonis.eu</p>
          </div>
          <div className="footer-bot" style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
            <p style={{color:'#334155',fontSize:'12px'}}>© 2026 Carbonis · EU strežniki · GDPR skladno</p>
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
