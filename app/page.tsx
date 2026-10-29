import Link from 'next/link'
import IndustrySelector from './components/IndustrySelector'

const navy = '#0B2471'
const cobalt = '#265CFF'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', color: '#0f172a' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none}
        button{cursor:pointer;border:none;background:none}
        .nl{color:#475569;font-size:14px;transition:color .15s}
        .nl:hover{color:#0B2471}
        .fc{transition:background .2s}
        .fc:hover{background:#f8faff!important}
        .it{transition:all .2s;cursor:pointer}
        .it:hover{border-color:#265CFF!important;background:#f0f5ff!important}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .f1{animation:float 6s ease-in-out infinite}
        .f2{animation:float 6s 2s ease-in-out infinite}
        details>summary{list-style:none;cursor:pointer}
        details>summary::-webkit-details-marker{display:none}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .dot-live{animation:pulse 2s infinite}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'white',borderBottom:'1px solid rgba(0,0,0,0.07)',boxShadow:'0 1px 8px rgba(0,0,0,0.05)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/"><img src="/carbonis-logo-light.png" alt="Carbonis" style={{height:'44px',width:'auto'}}/></Link>
          <div style={{display:'flex',gap:'28px',alignItems:'center'}}>
            <a href="#kako-deluje" className="nl">Kako deluje</a>
            <a href="#panoge" className="nl">Panoge</a>
            <a href="#paketi" className="nl">Paketi</a>
            <a href="#faq" className="nl">FAQ</a>
          </div>
          <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
            <Link href="/login" style={{color:'#475569',fontSize:'14px',fontWeight:500}}>Prijava</Link>
            <Link href="/register" style={{background:cobalt,color:'white',fontSize:'14px',fontWeight:600,padding:'9px 20px',borderRadius:'8px',display:'inline-flex',alignItems:'center',gap:'5px'}}>Začnite brezplačno →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{background:'linear-gradient(160deg,#06101e 0%,#0b1d38 50%,#081424 100%)',minHeight:'680px',position:'relative',overflow:'hidden',display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'80px 32px',display:'flex',alignItems:'center',gap:'60px',width:'100%',position:'relative',zIndex:2}}>
          {/* Left */}
          <div style={{flex:'0 0 500px',maxWidth:'500px'}}>
            <p style={{color:'#93c5fd',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'22px'}}>Za lokalna podjetja · Slovenija & Hrvaška</p>
            <h1 style={{fontSize:'52px',fontWeight:800,lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:'24px'}}>
              <span style={{color:'white',display:'block'}}>Vaše stranke se</span>
              <span style={{color:cobalt,display:'block'}}>vračajo same.</span>
            </h1>
            <p style={{color:'#94a3b8',fontSize:'16px',lineHeight:1.7,marginBottom:'32px',maxWidth:'420px'}}>
              Medtem ko vi delate tisto v čemer ste najboljši, naš sistem skrbi da <strong style={{color:'#cbd5e1'}}>stare stranke ne pozabijo na vas</strong>, da je vaš telefon vedno sprejet in da vas nove stranke najdejo na spletu.
            </p>
            <div style={{display:'flex',gap:'12px',marginBottom:'36px',flexWrap:'wrap'}}>
              <a href="#panoge" style={{background:cobalt,color:'white',fontSize:'14px',fontWeight:600,padding:'11px 24px',borderRadius:'8px',display:'inline-flex',alignItems:'center',gap:'6px'}}>Preverite za vaše podjetje →</a>
              <a href="#paketi" style={{color:'white',fontSize:'14px',fontWeight:500,padding:'11px 24px',borderRadius:'8px',border:'1.5px solid rgba(255,255,255,0.25)',display:'inline-flex',alignItems:'center'}}>Oglejte si pakete</a>
            </div>
            <div style={{display:'flex',gap:'28px',flexWrap:'wrap'}}>
              {[['15–25%','vrnjenih strank'],['4,8 ★','povprečna Google ocena'],['30 dni','do prvih rezultatov']].map(([v,l]) => (
                <div key={l} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5L5 9 10.5 4" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <span style={{color:'#94a3b8',fontSize:'13px'}}><strong style={{color:'white'}}>{v}</strong> {l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — live activity dashboard */}
          <div style={{flex:1,position:'relative',minHeight:'520px'}}>
            <div style={{position:'absolute',right:'-40px',top:'50%',transform:'translateY(-50%)',width:'560px',height:'560px',borderRadius:'50%',background:'radial-gradient(circle at center,rgba(38,92,255,0.18) 0%,rgba(38,92,255,0.05) 50%,transparent 75%)',pointerEvents:'none'}}/>
            {/* Main dashboard card */}
            <div style={{position:'absolute',right:'20px',top:'50%',transform:'translateY(-50%)',width:'340px',background:'rgba(6,12,28,0.92)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'16px',overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.4)'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{color:'white',fontSize:'12px',fontWeight:700}}>Carbonis · v živo</span>
                <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                  <span className="dot-live" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}}/>
                  <span style={{color:'#4ade80',fontSize:'10px',fontWeight:600}}>Aktivno</span>
                </div>
              </div>
              <div style={{padding:'16px 18px'}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'16px'}}>
                  {[
                    {l:'Vrnjene stranke',v:'+23',c:'#4ade80'},
                    {l:'Novih ocen',v:'+18',c:'#f59e0b'},
                    {l:'Termini',v:'94%',c:'#60a5fa'},
                  ].map(k => (
                    <div key={k.l} style={{background:'rgba(255,255,255,0.06)',borderRadius:'8px',padding:'10px 8px'}}>
                      <div style={{color:'rgba(255,255,255,0.5)',fontSize:'8px',marginBottom:'4px'}}>{k.l}</div>
                      <div style={{color:k.c,fontSize:'18px',fontWeight:800}}>{k.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'10px',marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                    <span style={{color:'rgba(255,255,255,0.5)',fontSize:'9px'}}>Vrnjene stranke · 6 mes</span>
                    <span style={{color:'#4ade80',fontSize:'9px',fontWeight:700}}>↑ +18%</span>
                  </div>
                  <svg viewBox="0 0 280 50" style={{width:'100%'}}>
                    <path d="M0 44 Q46 40 93 33 Q140 26 187 19 Q234 13 280 8" fill="none" stroke={cobalt} strokeWidth="2"/>
                    <path d="M0 44 Q46 40 93 33 Q140 26 187 19 Q234 13 280 8 L280 50 L0 50Z" fill="url(#hg)"/>
                    <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={cobalt} stopOpacity="0.3"/><stop offset="100%" stopColor={cobalt} stopOpacity="0"/></linearGradient></defs>
                    {['Maj','Jun','Jul','Avg','Sep','Okt'].map((m,i) => <text key={m} x={i*56} y="49" fill="rgba(255,255,255,0.3)" fontSize="7">{m}</text>)}
                  </svg>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  {[
                    {name:'Janez K.',action:'naročen termin',c:'#4ade80'},
                    {name:'Maja T.',action:'pustila 5★ oceno',c:'#f59e0b'},
                    {name:'Rok P.',action:'sprejel povabilo',c:'#60a5fa'},
                  ].map(r => (
                    <div key={r.name} style={{display:'flex',alignItems:'center',gap:'8px',background:'rgba(255,255,255,0.04)',borderRadius:'6px',padding:'7px 10px'}}>
                      <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'rgba(38,92,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:700,flexShrink:0}}>{r.name[0]}</div>
                      <div style={{flex:1,minWidth:0,fontSize:'11px'}}>
                        <span style={{color:'white',fontWeight:600}}>{r.name}</span>
                        <span style={{color:'rgba(255,255,255,0.4)'}}> · {r.action}</span>
                      </div>
                      <div style={{width:'6px',height:'6px',borderRadius:'50%',background:r.c,flexShrink:0}}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="f1" style={{position:'absolute',left:'0px',top:'calc(50% - 110px)',background:'rgba(6,12,28,0.92)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',padding:'14px 18px',minWidth:'180px',zIndex:5}}>
              <p style={{color:'#94a3b8',fontSize:'10px',marginBottom:'6px'}}>Klici sprejetih</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
                <span style={{color:'white',fontSize:'18px',fontWeight:800}}>100%</span>
                <div style={{display:'flex',gap:'2px',alignItems:'flex-end'}}>
                  {[65,80,55,90,70,95,100].map((h,i) => <div key={i} style={{width:'4px',background:cobalt,borderRadius:'2px',height:`${h*0.22}px`}}/>)}
                </div>
              </div>
            </div>
            <div className="f2" style={{position:'absolute',left:'10px',top:'calc(50% + 70px)',background:'rgba(6,12,28,0.92)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',padding:'14px 18px',minWidth:'180px',zIndex:5}}>
              <p style={{color:'#94a3b8',fontSize:'10px',marginBottom:'6px'}}>Google ocena</p>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{color:'#f59e0b',fontSize:'18px',fontWeight:800}}>4,8</span>
                <div style={{display:'flex',gap:'2px'}}>
                  {[...Array(5)].map((_,i) => <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#f59e0b"><path d="M6 1l1.2 2.4L10 4l-2 1.9.5 2.7L6 7.4 3.5 8.6l.5-2.7L2 4l2.8-.6z"/></svg>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZAKAJ CARBONIS ── */}
      <section id="kako-deluje" style={{background:'white',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{display:'flex',gap:'80px',marginBottom:'64px',alignItems:'flex-start'}}>
            <div style={{flexShrink:0}}>
              <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Zakaj Carbonis</p>
              <h2 style={{fontSize:'44px',fontWeight:800,lineHeight:1.12,letterSpacing:'-0.03em'}}>
                <span style={{color:'#0f172a',display:'block'}}>Pasivna baza strank.</span>
                <span style={{color:cobalt,display:'block'}}>Aktiviran prihodek.</span>
              </h2>
            </div>
            <div style={{flex:1,paddingTop:'52px',maxWidth:'480px'}}>
              <p style={{color:'#64748b',fontSize:'16px',lineHeight:1.75}}>V vaši bazi spi denar. Stranke ki so bile pri vas zadovoljne in niso prišle nazaj — ne zato ker niso bile zadovoljne, ampak ker jih nihče ni prišel iskat. Carbonis to naredi namesto vas.</p>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
            {[
              {title:'Reaktivacija strank',body:'Vsaka stranka ki je bila pri vas in 3+ mesece ni prišla dobi osebno sporočilo z vašim imenom — v pravem trenutku.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11a8 8 0 108-8" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/><path d="M3 7v4h4" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>},
              {title:'Google ocene',body:'Po vsaki storitvi stranka dobi prošnjo za oceno. Vaš Google profil raste sam, brez vašega truda.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l2.4 4.8 5.3 1-3.8 3.7.9 5.3L11 14.4l-4.8 2.4.9-5.3L3.3 7.8l5.3-1z" stroke={cobalt} strokeWidth="1.5" strokeLinejoin="round"/></svg>},
              {title:'Booking 24/7',body:'Naročanje poteka 24/7 brez vas. Stranka si sama izbere termin, ki pade v vaš urnik. Brez enega klica.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="15" rx="2" stroke={cobalt} strokeWidth="1.5"/><path d="M7 3v4M15 3v4M3 10h16" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/></svg>},
              {title:'GEO & AI vidljivost',body:'Vaše podjetje prikazano na vrhu ko lokalni kupci iščejo vašo storitev — v Google in AI iskalnikih.',icon:<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="9" r="4" stroke={cobalt} strokeWidth="1.5"/><path d="M11 2a9 9 0 019 9c0 5-9 12-9 12S2 16 2 11a9 9 0 019-9z" stroke={cobalt} strokeWidth="1.5"/></svg>},
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

      {/* ── PROCES + MOCKUP ── */}
      <section style={{background:'#f5f7fa',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'56px',alignItems:'center'}}>
          <div style={{flex:'0 0 400px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Postavljeno v 24 urah</p>
            <h2 style={{fontSize:'38px',fontWeight:800,lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'20px'}}>
              Štirje koraki<br/>do <span style={{color:cobalt}}>prvih rezultatov.</span>
            </h2>
            <p style={{color:'#64748b',fontSize:'15px',lineHeight:1.75,marginBottom:'32px'}}>Ni tehničnega znanja potrebno. Prinesete kar imate. V 7–14 dneh vidite prve odzive strank, v 30 dneh prve rezultate v evrih.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
              {[
                ['01','Poveste nam o svojih strankah','Prinesete kar imate — seznam, Excel, ali kar koli drugega.'],
                ['02','Sistem se postavi za vas','V 24 urah je vse pripravljeno. Nobenih tehničnih znanj.'],
                ['03','Stare stranke se začnejo vračati','V 7–14 dneh vidite prve odzive. V 30 dneh prve € rezultate.'],
                ['04','Sistem dela naprej sam','Vi se fokusirate na vaše delo. Ostalo je naše.'],
              ].map(([num,title,desc],i,arr) => (
                <div key={num} style={{display:'flex',gap:'20px',paddingBottom:i<arr.length-1?'24px':'0',position:'relative'}}>
                  {i<arr.length-1 && <div style={{position:'absolute',left:'19px',top:'40px',width:'1px',height:'calc(100% - 16px)',background:'#e2e8f0'}}/>}
                  <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'white',border:`2px solid ${cobalt}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:800,color:cobalt,flexShrink:0,zIndex:1}}>{num}</div>
                  <div style={{paddingTop:'8px'}}>
                    <h4 style={{fontSize:'15px',fontWeight:700,color:'#0f172a',marginBottom:'4px'}}>{title}</h4>
                    <p style={{fontSize:'13.5px',color:'#64748b',lineHeight:1.6}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{flex:1}}>
            <div style={{background:'white',borderRadius:'14px',boxShadow:'0 4px 6px -1px rgba(0,0,0,0.07),0 24px 60px -10px rgba(11,36,113,0.12)',overflow:'hidden',display:'flex',height:'430px',border:'1px solid #e2e8f0'}}>
              <div style={{width:'148px',background:navy,padding:'0',flexShrink:0}}>
                <div style={{padding:'16px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <span style={{color:'white',fontSize:'11px',fontWeight:700}}>Carbonis</span>
                </div>
                {([['Dashboard',true],['Stranke',false],['Kampanje',false],['Ocene',false],['Klici',false],['Poročila',false],['Nastavitve',false]] as [string,boolean][]).map(([label,active]) => (
                  <div key={label} style={{padding:'8px 14px',fontSize:'12px',color:active?'white':'rgba(255,255,255,0.42)',background:active?'rgba(255,255,255,0.12)':'transparent',fontWeight:active?600:400,borderLeft:active?'2px solid #60a5fa':'2px solid transparent'}}>{label}</div>
                ))}
              </div>
              <div style={{flex:1,padding:'16px 18px',overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
                  <span style={{fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Dashboard</span>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'11px',color:'#64748b',background:'#f1f5f9',padding:'3px 8px',borderRadius:'5px'}}>Janezov Avtoservis ▾</span>
                    <div style={{width:'22px',height:'22px',borderRadius:'50%',background:cobalt,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:700}}>JK</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'12px'}}>
                  {[
                    {l:'Vrnjene stranke',v:'+23',d:'↑ 15% vs. prejšnji mes',c:'#22c55e'},
                    {l:'Novih Google ocen',v:'+18',d:'Povp. ocena: 4,8 ★',c:'#f59e0b'},
                    {l:'Zapolnjeni termini',v:'94%',d:'Booking sistem aktiven',c:cobalt},
                  ].map(k => (
                    <div key={k.l} style={{background:'#f8fafc',borderRadius:'8px',padding:'9px',border:'1px solid #f1f5f9'}}>
                      <div style={{color:'#94a3b8',fontSize:'8.5px',marginBottom:'4px'}}>{k.l}</div>
                      <div style={{color:'#0f172a',fontSize:'14px',fontWeight:800,marginBottom:'3px'}}>{k.v}</div>
                      <div style={{color:k.c,fontSize:'8.5px'}}>{k.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'8px'}}>
                  <div style={{background:'#f8fafc',borderRadius:'8px',padding:'10px',border:'1px solid #f1f5f9'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                      <span style={{fontSize:'9.5px',fontWeight:600,color:'#334155'}}>Vrnjene stranke</span>
                      <span style={{color:'#22c55e',fontSize:'8.5px',fontWeight:700}}>↑ +18%</span>
                    </div>
                    <svg viewBox="0 0 200 65" style={{width:'100%'}}>
                      {[0,20,40,60].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#f1f5f9" strokeWidth="0.5"/>)}
                      <path d="M0 55 Q25 50 50 44 Q75 36 100 28 Q125 22 150 16 Q175 11 200 7" fill="none" stroke={cobalt} strokeWidth="1.5"/>
                      <path d="M0 55 Q25 50 50 44 Q75 36 100 28 Q125 22 150 16 Q175 11 200 7 L200 65 L0 65Z" fill="url(#mg2)"/>
                      <defs><linearGradient id="mg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={cobalt} stopOpacity="0.2"/><stop offset="100%" stopColor={cobalt} stopOpacity="0"/></linearGradient></defs>
                      {['Maj','Jun','Jul','Avg','Sep','Okt'].map((m,i) => <text key={m} x={i*40} y="63" fill="#94a3b8" fontSize="6.5" textAnchor="middle">{m}</text>)}
                    </svg>
                  </div>
                  <div style={{background:'#f8fafc',borderRadius:'8px',padding:'10px',border:'1px solid #f1f5f9'}}>
                    <div style={{fontSize:'9.5px',fontWeight:600,color:'#334155',marginBottom:'8px'}}>Aktivne kampanje</div>
                    {[['#4ade80','Reaktivacija','43%'],[cobalt,'Ocene','28%'],['#a78bfa','Booking','18%'],['#94a3b8','Voice','11%']].map(([c,l,v]) => (
                      <div key={l} style={{display:'flex',alignItems:'center',gap:'4px',marginBottom:'5px'}}>
                        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:c,flexShrink:0}}/>
                        <span style={{color:'#64748b',fontSize:'8px',flex:1}}>{l}</span>
                        <span style={{color:'#334155',fontSize:'8px',fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                    <div style={{display:'flex',justifyContent:'center',marginTop:'6px'}}>
                      <svg viewBox="0 0 60 60" width="52" height="52">
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#f1f5f9" strokeWidth="10"/>
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#4ade80" strokeWidth="10" strokeDasharray="59 80" strokeDashoffset="-14"/>
                        <circle cx="30" cy="30" r="22" fill="none" stroke={cobalt} strokeWidth="10" strokeDasharray="37 102" strokeDashoffset="-73"/>
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#a78bfa" strokeWidth="10" strokeDasharray="23 116" strokeDashoffset="-110"/>
                        <text x="30" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0f172a">89%</text>
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
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'flex-start'}}>
          <div style={{flex:'0 0 260px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>Personalizirano za vas</p>
            <h2 style={{fontSize:'32px',fontWeight:800,color:'#0f172a',lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:'14px'}}>Izberite svojo panogo</h2>
            <p style={{color:'#64748b',fontSize:'14px',lineHeight:1.7,marginBottom:'24px'}}>Carbonis se prilagodi vaši branži — pravi timing, sporočila in ROI izračun za vsako vrsto lokalnega podjetja.</p>
            <a href="#paketi" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:cobalt,fontSize:'14px',fontWeight:600,border:`1.5px solid ${cobalt}`,padding:'8px 18px',borderRadius:'8px'}}>Oglejte si pakete →</a>
          </div>
          <div style={{flex:1}}>
            <IndustrySelector />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{background:'#f8fafc',padding:'64px 0',borderTop:'1px solid #f1f5f9',borderBottom:'1px solid #f1f5f9'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{display:'flex',gap:'64px',alignItems:'center',flexWrap:'wrap'}}>
            <div style={{flex:'0 0 260px'}}>
              <h3 style={{fontSize:'22px',fontWeight:800,color:'#0f172a',lineHeight:1.3,marginBottom:'12px'}}>Pravi rezultati pri resničnih strankah</h3>
              <p style={{color:'#64748b',fontSize:'13.5px',lineHeight:1.65}}>Lokalna podjetja v Sloveniji in Hrvaški ki so prenehala izgubljati stranke.</p>
            </div>
            <div style={{flex:1,borderLeft:'1px solid #e2e8f0',paddingLeft:'64px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
                {[...Array(5)].map((_,i) => <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#F59E0B"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>)}
                <span style={{color:'#64748b',fontSize:'13px',marginLeft:'4px'}}>5.0 / 5</span>
              </div>
              <blockquote style={{color:'#0f172a',fontSize:'15px',lineHeight:1.7,fontStyle:'italic',marginBottom:'16px',maxWidth:'520px'}}>
                &ldquo;Nisem vedel da imam 340 strank ki so bile pri meni in 2+ let niso prišle. Mesec dni po zagonu so se začele vračati. Brez enega mojega klica.&rdquo;
              </blockquote>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'50%',background:navy,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'13px',fontWeight:700}}>JK</div>
                <div>
                  <div style={{fontSize:'13.5px',fontWeight:600,color:'#0f172a'}}>Janez K.</div>
                  <div style={{fontSize:'12px',color:'#64748b'}}>Avtoservis, Ljubljana</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAKETI ── */}
      <section id="paketi" style={{background:'#f5f7fa',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{textAlign:'center',marginBottom:'52px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>Transparentne cene</p>
            <h2 style={{fontSize:'38px',fontWeight:800,color:'#0f172a',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'16px'}}>Brez presenečenj. <span style={{color:cobalt}}>Brez skritih stroškov.</span></h2>
            <p style={{color:'#64748b',fontSize:'16px'}}>Brez začetne postavitve. Starter in Growth: odpoveste kadarkoli.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',alignItems:'start'}}>
            {[
              {name:'STARTER',price:'149',badge:null,for:'Manjša podjetja ki želijo preveriti ali sistem deluje',features:['Reaktivacija starih strank (SMS)','Zbiranje Google ocen','Follow-up sekvence','Mini poročila'],missing:['Voice klici','GEO vidljivost','Booking sistem']},
              {name:'GROWTH',price:'249',badge:'Najpopularnejši',for:'Podjetja ki želijo rast na vseh kanalih',features:['Vse iz Starter','Uvoz baze strank','GEO/AI vidljivost','Booking sistem','Polni dashboard','AI odgovori na ocene'],missing:['Voice klici (outbound)']},
              {name:'PRO',price:'349',badge:'12-mes. pogodba',for:'Podjetja ki hočejo maksimalne rezultate',features:['Vse iz Growth','Glasovni asistent 24/7','Glasovni klici starim strankam','Dedicirani telefon (SI/HR)','Prioritetna podpora'],missing:[]},
            ].map(pkg => (
              <div key={pkg.name} style={{background:'white',borderRadius:'14px',padding:'32px',border:pkg.name==='GROWTH'?`2px solid ${cobalt}`:'1px solid #e2e8f0',boxShadow:pkg.name==='GROWTH'?`0 4px 20px rgba(38,92,255,0.12)`:'0 1px 4px rgba(0,0,0,0.06)',position:'relative',transform:pkg.name==='GROWTH'?'scale(1.03)':'none'}}>
                {pkg.badge && <div style={{position:'absolute',top:'-13px',left:'50%',transform:'translateX(-50%)',background:pkg.name==='GROWTH'?cobalt:'#64748b',color:'white',fontSize:'11px',fontWeight:700,padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>{pkg.badge}</div>}
                <p style={{fontWeight:800,fontSize:'12px',color:'#64748b',letterSpacing:'0.08em',marginBottom:'10px'}}>{pkg.name}</p>
                <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'8px'}}>
                  <span style={{fontSize:'40px',fontWeight:800,color:navy}}>{pkg.price} €</span>
                  <span style={{color:'#64748b',fontSize:'14px'}}>/mes</span>
                </div>
                <p style={{fontSize:'13px',color:'#64748b',marginBottom:'24px',lineHeight:1.5}}>{pkg.for}</p>
                <div style={{borderTop:'1px solid #f1f5f9',paddingTop:'18px',display:'flex',flexDirection:'column',gap:'9px'}}>
                  {pkg.features.map(f => (
                    <div key={f} style={{display:'flex',gap:'8px',fontSize:'13px',color:'#374151',alignItems:'flex-start'}}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:'1px'}}><circle cx="8" cy="8" r="8" fill="#EEF2FF"/><path d="M5 8l2 2 4-4" stroke={cobalt} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      {f}
                    </div>
                  ))}
                  {pkg.missing.map(f => (
                    <div key={f} style={{display:'flex',gap:'8px',fontSize:'13px',color:'#cbd5e1',alignItems:'flex-start'}}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0,marginTop:'1px'}}><circle cx="7" cy="7" r="7" fill="#f1f5f9"/><path d="M5 5l4 4M9 5l-4 4" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/></svg>
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
          <p style={{textAlign:'center',fontSize:'14px',color:'#16a34a',fontWeight:600,marginTop:'36px'}}>✓ Garancija: 10 reaktiviranih strank v 60 dneh ali podaljšamo brezplačno.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{background:'white',padding:'88px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'80px',alignItems:'flex-start'}}>
          <div style={{flex:'0 0 280px'}}>
            <p style={{color:cobalt,fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'14px'}}>FAQ</p>
            <h2 style={{fontSize:'32px',fontWeight:800,color:'#0f172a',lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:'14px'}}>Pogosta vprašanja</h2>
            <p style={{color:'#64748b',fontSize:'14px',lineHeight:1.7}}>Niste našli odgovora? Pogovorite se z Vero — odgovori takoj.</p>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'2px'}}>
            {[
              ['Kaj če nimam urejene baze strank?','Ni problema. Pošljite kar imate — Excel, seznam, foto papirja. Uredimo za vas brez doplačila.'],
              ['Kako hitro vidim prve rezultate?','Prve odzive strank tipično vidite v 7–14 dneh. Garancija: 10 reaktiviranih strank v 60 dneh.'],
              ['Ali bodo moje stranke vedele da gre za sistem?','Ne. Sporočila gredo z vašim imenom in vašo telefonsko številko. Za stranko ste to vi.'],
              ['Kaj če odpovem?','Starter in Growth: odpoveste kadarkoli brez kazni. Pro: 12-mesečna pogodba.'],
              ['Ali so moji podatki varni?','Vsi podatki shranjeni na EU strežnikih. GDPR skladnost zagotovljena.'],
              ['Kako poteka postavitev?','Izpolnite kratek vprašalnik (10 min). V 24 urah je sistem pripravljen. Nobenih tehničnih znanj.'],
            ].map(([q,a]) => (
              <details key={q} style={{background:'#f8fafc',borderRadius:'10px',border:'1px solid #f1f5f9',padding:'18px 22px'}}>
                <summary style={{fontWeight:600,fontSize:'15px',color:'#0f172a',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'16px'}}>
                  {q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M4 6l4 4 4-4" stroke={cobalt} strokeWidth="1.6" strokeLinecap="round"/></svg>
                </summary>
                <p style={{marginTop:'12px',fontSize:'14px',color:'#64748b',lineHeight:1.65}}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background:'#0B1E3D',padding:'72px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'40px',flexWrap:'wrap'}}>
          <div>
            <p style={{color:'#93c5fd',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'12px'}}>Pripravljeni začeti?</p>
            <h2 style={{fontSize:'36px',fontWeight:800,color:'white',lineHeight:1.2,letterSpacing:'-0.02em'}}>Preverite koliko strank<br/>spi v vaši bazi.</h2>
          </div>
          <div>
            <p style={{color:'#94a3b8',fontSize:'14px',lineHeight:1.65,marginBottom:'20px',maxWidth:'280px'}}>Brezplačen pregled vaše situacije. Povemo koliko strank imate v &ldquo;spečem&rdquo; stanju in koliko bi jih lahko reaktivirali.</p>
            <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:cobalt,color:'white',fontSize:'15px',fontWeight:700,padding:'13px 28px',borderRadius:'9px'}}>Začnite brezplačno →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="about" style={{background:'#0d1a2e',padding:'52px 0 26px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'40px',flexWrap:'wrap',gap:'20px'}}>
            <Link href="/"><img src="/carbonis-logo-dark.png" alt="Carbonis" style={{height:'52px',width:'auto'}}/></Link>
            <nav style={{display:'flex',gap:'24px'}}>
              {[['Kako deluje','#kako-deluje'],['Panoge','#panoge'],['Paketi','#paketi'],['FAQ','#faq'],['Prijava','/login']].map(([l,h]) => (
                <a key={l} href={h} style={{color:'#64748b',fontSize:'13px'}}>{l}</a>
              ))}
            </nav>
            <p style={{color:'#475569',fontSize:'12px'}}>info@carbonis.eu</p>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
            <p style={{color:'#334155',fontSize:'12px'}}>© 2026 Carbonis. Vsi podatki na EU strežnikih · GDPR skladno.</p>
            <div style={{display:'flex',gap:'18px'}}>
              {['Politika zasebnosti','Pogoji uporabe'].map(l => <a key={l} href="#" style={{color:'#334155',fontSize:'12px'}}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
