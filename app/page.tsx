export const instant = false

import Link from 'next/link'
import InlineCbamCalc from './components/InlineCbamCalc'

async function getEtsPrice(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/ets-price`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      return data.price ?? 65.40
    }
  } catch { /* fallback */ }
  return 65.40
}

export default async function HomePage() {
  const etsPrice = await getEtsPrice()

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', color: '#0f172a' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none}
        button{cursor:pointer;border:none;background:none}
        .nl{color:#64748b;font-size:14px;transition:color .15s}
        .nl:hover{color:#0f172a}
        .fc{transition:background .2s}
        .fc:hover{background:#f8faff!important}
        .it{transition:all .2s;cursor:pointer}
        .it:hover{border-color:#265CFF!important;background:#f0f5ff!important}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .f1{animation:float 5s ease-in-out infinite}
        .f2{animation:float 5s 1.5s ease-in-out infinite}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.97)',backdropFilter:'blur(16px)',borderBottom:'1px solid #e2e8f0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/"><img src="/carbonis-logo-light.png" alt="Carbonis" style={{height:'40px',width:'auto'}}/></Link>
          <div style={{display:'flex',gap:'28px',alignItems:'center'}}>
            <a href="#" style={{color:'#265CFF',fontSize:'14px',borderBottom:'2px solid #265CFF',paddingBottom:'2px'}}>Home</a>
            <a href="#platform" className="nl">Product</a>
            <a href="#industries" className="nl">Solutions</a>
            <a href="#calculator" className="nl">Pricing</a>
            <a href="#calculator" className="nl">Resources</a>
            <a href="#about" className="nl">About</a>
          </div>
          <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
            <Link href="/login" style={{color:'#0f172a',fontSize:'14px',fontWeight:500}}>Login</Link>
            <Link href="/register" style={{background:'#265CFF',color:'white',fontSize:'14px',fontWeight:600,padding:'9px 20px',borderRadius:'8px',display:'inline-flex',alignItems:'center',gap:'5px'}}>Get started →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{background:'linear-gradient(160deg,#06101e 0%,#0b1d38 50%,#081424 100%)',minHeight:'580px',position:'relative',overflow:'hidden',display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 32px',display:'flex',alignItems:'center',gap:'40px',width:'100%',position:'relative',zIndex:2}}>
          {/* Left */}
          <div style={{flex:'0 0 480px',maxWidth:'480px'}}>
            <p style={{color:'#93c5fd',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'22px'}}>EU Carbon Compliance Platform</p>
            <h1 style={{fontSize:'52px',fontWeight:800,lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:'24px'}}>
              <span style={{color:'white',display:'block'}}>Stay compliant.</span>
              <span style={{color:'#265CFF',display:'block'}}>Reduce your footprint.</span>
            </h1>
            <p style={{color:'#94a3b8',fontSize:'16px',lineHeight:1.7,marginBottom:'32px',maxWidth:'400px'}}>
              Carbonis helps EU importers and businesses navigate <strong style={{color:'#cbd5e1'}}>carbon regulations</strong> with confidence. Track, calculate, report — all in one platform.
            </p>
            <div style={{display:'flex',gap:'12px',marginBottom:'32px',flexWrap:'wrap'}}>
              <Link href="/register" style={{background:'#265CFF',color:'white',fontSize:'14px',fontWeight:600,padding:'11px 24px',borderRadius:'8px',display:'inline-flex',alignItems:'center',gap:'6px'}}>Get started →</Link>
              <a href="#demo" style={{color:'white',fontSize:'14px',fontWeight:500,padding:'11px 24px',borderRadius:'8px',border:'1.5px solid rgba(255,255,255,0.25)',display:'inline-flex',alignItems:'center'}}>Book a demo</a>
            </div>
            <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
              {['EU ETS','CBAM','ESRS','CSRD'].map(tag => (
                <div key={tag} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5L5 9 10.5 4" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <span style={{color:'#94a3b8',fontSize:'13px'}}>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Earth globe */}
          <div style={{flex:1,position:'relative',minHeight:'520px'}}>
            {/* Atmospheric glow ring */}
            <div style={{position:'absolute',right:'-30px',top:'50%',transform:'translateY(-50%)',width:'590px',height:'590px',borderRadius:'50%',background:'radial-gradient(circle,transparent 43%,rgba(38,92,255,0.18) 54%,rgba(96,165,250,0.08) 70%,transparent 86%)',pointerEvents:'none',zIndex:1}}/>
            {/* Earth circle */}
            <div style={{position:'absolute',right:'-30px',top:'50%',transform:'translateY(-50%)',width:'530px',height:'530px',borderRadius:'50%',overflow:'hidden',boxShadow:'0 0 0 1.5px rgba(38,92,255,0.3),0 0 50px rgba(38,92,255,0.28),0 0 110px rgba(11,36,113,0.22)',zIndex:2}}>
              <img src="/earth-globe.jpg" alt="Earth from space" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center center'}}/>
            </div>
            {/* Left fade into hero bg */}
            <div style={{position:'absolute',top:0,left:0,bottom:0,width:'160px',background:'linear-gradient(to right,#06101e,transparent)',zIndex:3,pointerEvents:'none'}}/>
            {/* Card 1 */}
            <div className="f1" style={{position:'absolute',right:'30px',top:'calc(50% - 110px)',background:'rgba(6,12,28,0.88)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'14px 18px',minWidth:'190px',zIndex:4}}>
              <p style={{color:'#94a3b8',fontSize:'11px',marginBottom:'8px'}}>Carbon emissions</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{color:'white',fontSize:'13px',fontWeight:700}}>under control</span>
                <svg viewBox="0 0 60 22" width="56" height="22"><path d="M0 18 Q15 14 30 9 Q45 5 60 2" stroke="#4ade80" strokeWidth="1.8" fill="none"/></svg>
              </div>
            </div>
            {/* Card 2 */}
            <div className="f2" style={{position:'absolute',right:'30px',top:'calc(50% + 30px)',background:'rgba(6,12,28,0.88)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'14px 18px',minWidth:'190px',zIndex:4}}>
              <p style={{color:'#94a3b8',fontSize:'11px',marginBottom:'5px'}}>Full compliance</p>
              <p style={{color:'white',fontSize:'13px',fontWeight:700}}>with EU regulations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CARBONIS ── */}
      <section id="why" style={{background:'white',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{display:'flex',gap:'80px',marginBottom:'64px',alignItems:'flex-start'}}>
            <div>
              <p style={{color:'#265CFF',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Why Carbonis</p>
              <h2 style={{fontSize:'44px',fontWeight:800,lineHeight:1.12,letterSpacing:'-0.03em'}}>
                <span style={{color:'#0f172a',display:'block'}}>Complex regulations.</span>
                <span style={{color:'#265CFF',display:'block'}}>Made simple.</span>
              </h2>
            </div>
            <div style={{flex:1,paddingTop:'52px',maxWidth:'480px'}}>
              <p style={{color:'#64748b',fontSize:'16px',lineHeight:1.75}}>We turn complex EU carbon regulations into a simple, clear and automated process — so you can focus on your business, not paperwork.</p>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
            {[
              {title:'Regulatory expertise',body:'Always up to date with the latest EU regulations and reporting requirements.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 1L2 5v6c0 5 3.2 9.7 9 11 5.8-1.3 9-6 9-11V5L11 1z" stroke="#265CFF" strokeWidth="1.5"/></svg>},
              {title:'Automated processes',body:'Save time with smart workflows, calculations and ready-to-use reports.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="#265CFF" strokeWidth="1.5"/><path d="M11 5.5v5.5l3.5 2" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/></svg>},
              {title:'Full transparency',body:'Track your emissions, data and compliance status in real time.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="11" width="4" height="9" rx="1" stroke="#265CFF" strokeWidth="1.5"/><rect x="9" y="6" width="4" height="14" rx="1" stroke="#265CFF" strokeWidth="1.5"/><rect x="16" y="2" width="4" height="18" rx="1" stroke="#265CFF" strokeWidth="1.5"/></svg>},
              {title:'Real impact',body:'Lower your carbon footprint and build a more sustainable supply chain.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C5.5 2 1 6.5 1 12s4.5 10 10 10" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 5c-2.5 1.5-3.5 4.5-2.5 7" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/><circle cx="16" cy="5" r="1.5" fill="#265CFF"/></svg>},
            ].map(f => (
              <div key={f.title} className="fc" style={{padding:'28px 22px',borderRadius:'12px',border:'1px solid #f1f5f9'}}>
                <div style={{width:'48px',height:'48px',background:'#EEF2FF',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>{f.icon}</div>
                <h3 style={{fontSize:'15px',fontWeight:700,color:'#0f172a',marginBottom:'10px'}}>{f.title}</h3>
                <p style={{color:'#64748b',fontSize:'13.5px',lineHeight:1.65}}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ── */}
      <section id="platform" style={{background:'#f5f7fa',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'56px',alignItems:'center'}}>
          <div style={{flex:'0 0 400px'}}>
            <p style={{color:'#265CFF',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>The Platform</p>
            <h2 style={{fontSize:'38px',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'20px'}}>
              Everything you need<br/>for <span style={{color:'#265CFF'}}>carbon compliance.</span>
            </h2>
            <p style={{color:'#64748b',fontSize:'15px',lineHeight:1.75,marginBottom:'28px'}}>From product carbon footprint calculations to CBAM reporting and EU ETS monitoring — Carbonis brings all your compliance needs into one intuitive platform.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'11px',marginBottom:'32px'}}>
              {['CBAM reporting & data management','EU ETS emissions tracking','Product carbon footprint (PCF)','ESRS & CSRD reporting','Supply chain data management'].map(item => (
                <div key={item} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#EEF2FF"/><path d="M5 8l2 2 4-4" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span style={{color:'#334155',fontSize:'14px'}}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#265CFF',color:'white',fontSize:'14px',fontWeight:600,padding:'10px 22px',borderRadius:'8px'}}>Explore all features →</Link>
          </div>

          {/* Dashboard mockup */}
          <div style={{flex:1}}>
            <div style={{background:'white',borderRadius:'14px',boxShadow:'0 4px 6px -1px rgba(0,0,0,0.07),0 24px 60px -10px rgba(11,36,113,0.12)',overflow:'hidden',display:'flex',height:'410px',border:'1px solid #e2e8f0'}}>
              {/* Sidebar */}
              <div style={{width:'148px',background:'#0B2471',padding:'0',flexShrink:0}}>
                <div style={{padding:'16px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'6px'}}>
                  <img src="/carbonis-icon.png" alt="" style={{height:'20px',width:'auto'}}/>
                  <span style={{color:'white',fontSize:'11px',fontWeight:700}}>Carbonis</span>
                </div>
                {([['Dashboard',true],['Emissions',false],['CBAM',false],['EU ETS',false],['Reports',false],['Suppliers',false],['Settings',false]] as [string,boolean][]).map(([label,active]) => (
                  <div key={label} style={{padding:'8px 14px',fontSize:'12px',color:active?'white':'rgba(255,255,255,0.42)',background:active?'rgba(255,255,255,0.12)':'transparent',fontWeight:active?600:400,borderLeft:active?'2px solid #60a5fa':'2px solid transparent'}}>{label}</div>
                ))}
              </div>
              {/* Content */}
              <div style={{flex:1,padding:'16px 18px',overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
                  <span style={{fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Dashboard</span>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'11px',color:'#64748b',background:'#f1f5f9',padding:'3px 8px',borderRadius:'5px'}}>Acme Europe Ltd. ▾</span>
                    <div style={{width:'22px',height:'22px',borderRadius:'50%',background:'#265CFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:700}}>JO</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'12px'}}>
                  {[
                    {l:'Total emissions',v:'12,480 t CO₂e',d:'↑ 12% vs. last quarter',c:'#ef4444'},
                    {l:'CBAM declarations',v:'8',d:'↑ 2 pending',c:'#f59e0b'},
                    {l:'Compliance status',v:'On track',d:'All requirements met',c:'#22c55e'},
                  ].map(k => (
                    <div key={k.l} style={{background:'#f8fafc',borderRadius:'8px',padding:'9px',border:'1px solid #f1f5f9'}}>
                      <div style={{color:'#94a3b8',fontSize:'8.5px',marginBottom:'4px'}}>{k.l}</div>
                      <div style={{color:'#0f172a',fontSize:'12.5px',fontWeight:800,marginBottom:'3px'}}>{k.v}</div>
                      <div style={{color:k.c,fontSize:'8.5px'}}>{k.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'8px'}}>
                  <div style={{background:'#f8fafc',borderRadius:'8px',padding:'10px',border:'1px solid #f1f5f9'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                      <span style={{fontSize:'9.5px',fontWeight:600,color:'#334155'}}>Emissions trend</span>
                      <span style={{fontSize:'8.5px',color:'#94a3b8'}}>2025 ▾</span>
                    </div>
                    <svg viewBox="0 0 200 65" style={{width:'100%'}}>
                      {[0,20,40,60].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#f1f5f9" strokeWidth="0.5"/>)}
                      <path d="M0 55 Q25 50 50 44 Q75 38 100 32 Q125 26 150 20 Q175 16 200 13" fill="none" stroke="#265CFF" strokeWidth="1.5"/>
                      <path d="M0 55 Q25 50 50 44 Q75 38 100 32 Q125 26 150 20 Q175 16 200 13 L200 65 L0 65Z" fill="url(#mg)"/>
                      <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#265CFF" stopOpacity="0.18"/><stop offset="100%" stopColor="#265CFF" stopOpacity="0"/></linearGradient></defs>
                      {['Jan','Mar','May','Jul','Sep','Nov'].map((m,i) => <text key={m} x={i*40} y="63" fill="#94a3b8" fontSize="6.5" textAnchor="middle">{m}</text>)}
                    </svg>
                  </div>
                  <div style={{background:'#f8fafc',borderRadius:'8px',padding:'10px',border:'1px solid #f1f5f9'}}>
                    <div style={{fontSize:'9.5px',fontWeight:600,color:'#334155',marginBottom:'8px'}}>Top emission sources</div>
                    <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}>
                      <svg viewBox="0 0 72 72" width="62" height="62">
                        <circle cx="36" cy="36" r="26" fill="none" stroke="#f1f5f9" strokeWidth="12"/>
                        <circle cx="36" cy="36" r="26" fill="none" stroke="#0B2471" strokeWidth="12" strokeDasharray="101 62" strokeDashoffset="-15"/>
                        <circle cx="36" cy="36" r="26" fill="none" stroke="#265CFF" strokeWidth="12" strokeDasharray="25 138" strokeDashoffset="-116"/>
                        <circle cx="36" cy="36" r="26" fill="none" stroke="#93c5fd" strokeWidth="12" strokeDasharray="14 149" strokeDashoffset="-141"/>
                        <text x="36" y="40" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">68%</text>
                      </svg>
                    </div>
                    {[['#0B2471','Raw materials','68%'],['#265CFF','Transport','16%'],['#93c5fd','Production','9%'],['#bfdbfe','Other','7%']].map(([c,l,v]) => (
                      <div key={l} style={{display:'flex',alignItems:'center',gap:'4px',marginBottom:'3px'}}>
                        <div style={{width:'5px',height:'5px',borderRadius:'50%',background:c,flexShrink:0}}/>
                        <span style={{color:'#64748b',fontSize:'7.5px',flex:1}}>{l}</span>
                        <span style={{color:'#334155',fontSize:'7.5px',fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section id="industries" style={{background:'white',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'center'}}>
          <div style={{flex:'0 0 280px'}}>
            <h2 style={{fontSize:'30px',fontWeight:800,color:'#0f172a',lineHeight:1.25,letterSpacing:'-0.02em',marginBottom:'14px'}}>Built for your industry</h2>
            <p style={{color:'#64748b',fontSize:'14px',lineHeight:1.7,marginBottom:'24px'}}>Whether you&apos;re an importer, manufacturer or distributor, Carbonis adapts to your business and supply chain.</p>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'#265CFF',fontSize:'14px',fontWeight:600,border:'1.5px solid #265CFF',padding:'8px 18px',borderRadius:'8px'}}>See all solutions →</Link>
          </div>
          <div style={{flex:1,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {[
              {label:'Importers\n& Distributors',icon:<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="8" width="20" height="13" rx="2" stroke="#265CFF" strokeWidth="1.5"/><path d="M7 8V6a2 2 0 012-2h8a2 2 0 012 2v2" stroke="#265CFF" strokeWidth="1.5"/><line x1="3" y1="14" x2="23" y2="14" stroke="#265CFF" strokeWidth="1"/></svg>},
              {label:'Manufacturers',icon:<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="5" y="9" width="16" height="14" rx="1" stroke="#265CFF" strokeWidth="1.5"/><path d="M9 9V7a4 4 0 018 0v2" stroke="#265CFF" strokeWidth="1.5"/><rect x="10" y="14" width="6" height="5" rx="1" stroke="#265CFF" strokeWidth="1"/></svg>},
              {label:'Retail &\nE-commerce',icon:<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 7h18l-2 12H6L4 7z" stroke="#265CFF" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7L9 4h8l1 3" stroke="#265CFF" strokeWidth="1.5"/><circle cx="9" cy="21" r="1.5" fill="#265CFF"/><circle cx="17" cy="21" r="1.5" fill="#265CFF"/></svg>},
              {label:'Large\nEnterprises',icon:<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="5" y="5" width="16" height="18" rx="2" stroke="#265CFF" strokeWidth="1.5"/><line x1="9" y1="10" x2="17" y2="10" stroke="#265CFF" strokeWidth="1"/><line x1="9" y1="14" x2="17" y2="14" stroke="#265CFF" strokeWidth="1"/><line x1="9" y1="18" x2="13" y2="18" stroke="#265CFF" strokeWidth="1"/></svg>},
            ].map(t => (
              <div key={t.label} className="it" style={{padding:'28px 20px',borderRadius:'12px',border:'1.5px solid #e2e8f0',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:'14px'}}>
                <div style={{width:'52px',height:'52px',background:'#EEF2FF',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center'}}>{t.icon}</div>
                <span style={{fontSize:'13px',fontWeight:600,color:'#0f172a',whiteSpace:'pre-line',lineHeight:1.4}}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{background:'white',padding:'88px 0',borderTop:'1px solid #f1f5f9'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'64px'}}>
          <div style={{flex:'0 0 360px'}}>
            <h2 style={{fontSize:'26px',fontWeight:800,color:'#0f172a',lineHeight:1.3,letterSpacing:'-0.02em',marginBottom:'12px'}}>Trusted by forward-thinking businesses across Europe</h2>
            <p style={{color:'#64748b',fontSize:'14px',lineHeight:1.7,marginBottom:'36px'}}>Join companies that are already turning compliance into a competitive advantage.</p>
            <div style={{display:'flex',gap:'24px',alignItems:'center',flexWrap:'wrap'}}>
              {[
                {n:'BOSCH',s:{fontWeight:900,fontSize:'14px',letterSpacing:'0.04em',color:'#475569'}},
                {n:'SIEMENS',s:{fontWeight:700,fontSize:'12px',letterSpacing:'0.06em',color:'#475569'}},
                {n:'Schneider Electric',s:{fontWeight:700,fontSize:'11px',color:'#475569'}},
                {n:"L'ORÉAL",s:{fontWeight:900,fontSize:'11px',letterSpacing:'0.08em',color:'#475569'}},
              ].map(c => <span key={c.n} style={{...c.s,opacity:0.65}}>{c.n}</span>)}
            </div>
          </div>
          <div style={{flex:1,background:'#f8fafc',borderRadius:'16px',padding:'36px',border:'1px solid #e2e8f0',position:'relative'}}>
            <div style={{position:'absolute',top:'28px',right:'32px',display:'flex',gap:'8px'}}>
              {['‹','›'].map(a => (
                <button key={a} style={{width:'28px',height:'28px',borderRadius:'50%',border:'1.5px solid #e2e8f0',background:'white',color:'#64748b',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>{a}</button>
              ))}
            </div>
            <div style={{fontSize:'42px',color:'#265CFF',lineHeight:0.9,marginBottom:'18px',fontFamily:'Georgia,serif'}}>&ldquo;</div>
            <p style={{color:'#1e293b',fontSize:'16px',lineHeight:1.75,marginBottom:'24px'}}>&ldquo;Carbonis has completely simplified our CBAM reporting process. What used to take weeks now takes hours. The platform is intuitive, reliable and the support team is outstanding.&rdquo;</p>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'linear-gradient(135deg,#0B2471,#265CFF)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'13px',fontWeight:700}}>JW</div>
              <div>
                <p style={{fontWeight:600,color:'#0f172a',fontSize:'14px'}}>Julia Weber</p>
                <p style={{color:'#64748b',fontSize:'12px'}}>Head of Sustainability, European Imports</p>
              </div>
            </div>
            <div style={{display:'flex',gap:'6px',marginTop:'20px'}}>
              <div style={{width:'20px',height:'4px',borderRadius:'2px',background:'#265CFF'}}/>
              <div style={{width:'8px',height:'4px',borderRadius:'2px',background:'#e2e8f0'}}/>
              <div style={{width:'8px',height:'4px',borderRadius:'2px',background:'#e2e8f0'}}/>
            </div>
          </div>
        </div>
      </section>

      {/* ── CBAM CALCULATOR ── */}
      <section id="calculator" style={{background:'#f5f7fa',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',marginBottom:'48px'}}>
            <p style={{color:'#265CFF',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>Free CBAM Calculator</p>
            <h2 style={{fontSize:'38px',fontWeight:800,color:'#0f172a',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'20px'}}>Know your liability <span style={{color:'#265CFF'}}>before the deadline.</span></h2>
            <div style={{display:'inline-flex',alignItems:'center',gap:'10px',background:'white',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 18px'}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#22c55e'}}/>
              <span style={{color:'#64748b',fontSize:'13px'}}>EU ETS live price:</span>
              <span style={{fontSize:'20px',fontWeight:800,color:'#0B2471'}}>€{etsPrice.toFixed(2)}</span>
              <span style={{color:'#94a3b8',fontSize:'13px'}}>/ tCO₂</span>
            </div>
          </div>
          <InlineCbamCalc etsPrice={etsPrice}/>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="demo" style={{background:'#0B1E3D',padding:'72px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'40px'}}>
          <div>
            <p style={{color:'#93c5fd',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'12px'}}>Ready to get started?</p>
            <h2 style={{fontSize:'36px',fontWeight:800,color:'white',lineHeight:1.2,letterSpacing:'-0.02em'}}>Your carbon compliance journey<br/>starts here.</h2>
          </div>
          <div>
            <p style={{color:'#94a3b8',fontSize:'14px',lineHeight:1.65,marginBottom:'20px',maxWidth:'280px'}}>Book a demo and see how Carbonis can simplify your compliance process.</p>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#265CFF',color:'white',fontSize:'15px',fontWeight:700,padding:'13px 28px',borderRadius:'9px'}}>Book a demo →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="about" style={{background:'#0d1a2e',padding:'52px 0 26px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'40px',flexWrap:'wrap',gap:'20px'}}>
            <Link href="/"><img src="/carbonis-logo-dark.png" alt="Carbonis" style={{height:'32px',width:'auto'}}/></Link>
            <nav style={{display:'flex',gap:'24px'}}>
              {['Product','Solutions','Pricing','Resources','About'].map(l => (
                <a key={l} href="#" style={{color:'#64748b',fontSize:'13px'}}>{l}</a>
              ))}
            </nav>
            <div style={{display:'flex',gap:'8px'}}>
              {[
                {d:<><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="#64748b"/><circle cx="4" cy="4" r="2" fill="#64748b"/></>},
                {d:<><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25z" fill="#64748b"/></>},
                {d:<><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95C23 15.87 23 12 23 12s0-3.87-.46-5.58z" fill="#64748b"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d1a2e"/></>},
              ].map(({d},i) => (
                <a key={i} href="#" style={{width:'30px',height:'30px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24">{d}</svg>
                </a>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
            <p style={{color:'#334155',fontSize:'12px'}}>© 2026 Carbonis. All rights reserved.</p>
            <div style={{display:'flex',gap:'18px'}}>
              {['Privacy Policy','Terms of Service','Imprint'].map(l => <a key={l} href="#" style={{color:'#334155',fontSize:'12px'}}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
