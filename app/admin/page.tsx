import Link from 'next/link'

const CLIENTS = [
  { id: 1, name: 'Acme Imports Ltd.', country: '🇩🇪 Germany', tier: 'PRO Compliance', status: 'Active', joined: 'Jan 2025' },
  { id: 2, name: 'Global Trade d.o.o.', country: '🇸🇮 Slovenia', tier: 'PRO Trading', status: 'Active', joined: 'Feb 2025' },
  { id: 3, name: 'Nordic Supply AG', country: '🇨🇭 Switzerland', tier: 'PRO Compliance', status: 'Active', joined: 'Mar 2025' },
  { id: 4, name: 'Balkan Logistics Ltd.', country: '🇭🇷 Croatia', tier: 'Free', status: 'Trial', joined: 'Apr 2025' },
  { id: 5, name: 'East West Trading', country: '🇦🇹 Austria', tier: 'PRO Compliance', status: 'Active', joined: 'May 2025' },
]

const ACTIVITY = [
  { time: '2 min ago', text: 'Acme Imports Ltd. submitted CBAM declaration Q3-2025', type: 'report' },
  { time: '18 min ago', text: 'New user registered — Nordic Supply AG', type: 'user' },
  { time: '1 hour ago', text: 'EU ETS price updated: €65.40 / tCO₂', type: 'system' },
  { time: '3 hours ago', text: 'Global Trade d.o.o. upgraded to PRO Trading', type: 'upgrade' },
]

export default function AdminPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.3"/><path d="M9.5 9.5L12 12" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <input type="text" placeholder="Search clients, users, regulations..." style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', height: '34px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#334155', background: '#f8fafc', outline: 'none' }} readOnly/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 015 5v3l1.5 2.5H1.5L3 9V6a5 5 0 015-5zM6.5 13.5a1.5 1.5 0 003 0" stroke="#64748b" strokeWidth="1.3"/></svg>
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', border: '1.5px solid white' }}/>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #265CFF, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>SA</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Super Admin</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

          {/* Page heading */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>Admin Overview</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Platform health, client management and compliance monitoring.</p>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Total clients', value: '24', change: '+3 this month', changeColor: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="#265CFF" strokeWidth="1.4"/><path d="M2.5 16.5c0-3.9 3-7 6.5-7s6.5 3.1 6.5 7" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg> },
              { label: 'Active users', value: '186', change: '+12 this week', changeColor: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6" cy="6" r="3" stroke="#265CFF" strokeWidth="1.4"/><circle cx="12" cy="6" r="3" stroke="#265CFF" strokeWidth="1.4"/><path d="M1 16c0-3 2-5 5-5M10 11c3 0 7 1.8 7 5" stroke="#265CFF" strokeWidth="1.4" strokeLinecap="round"/></svg> },
              { label: 'Reports generated', value: '342', change: '+28 this month', changeColor: '#22c55e', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="1.5" stroke="#265CFF" strokeWidth="1.4"/><path d="M6 7h6M6 10h6M6 13h3" stroke="#265CFF" strokeWidth="1.3" strokeLinecap="round"/></svg> },
              { label: 'Pending actions', value: '7', change: '↑ 2 require attention', changeColor: '#f59e0b', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#265CFF" strokeWidth="1.4"/><path d="M9 6v4M9 12v.5" stroke="#265CFF" strokeWidth="1.5" strokeLinecap="round"/></svg> },
            ].map(k => (
              <div key={k.label} style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>{k.label}</p>
                  <div style={{ width: '34px', height: '34px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{k.icon}</div>
                </div>
                <p style={{ color: '#0f172a', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>{k.value}</p>
                <p style={{ color: k.changeColor, fontSize: '11px' }}>{k.change}</p>
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>

            {/* Clients table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Clients</h3>
                <Link href="/admin/clients" style={{ fontSize: '12px', color: '#265CFF', fontWeight: 500, textDecoration: 'none' }}>View all →</Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Company','Country','Plan','Status','Joined'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLIENTS.map((c, i) => (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{c.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>{c.country}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                        <span style={{ background: c.tier === 'Free' ? '#f1f5f9' : '#EEF2FF', color: c.tier === 'Free' ? '#64748b' : '#265CFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '11px' }}>{c.tier}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.status === 'Active' ? '#22c55e' : '#f59e0b' }}/>
                          <span style={{ color: '#334155' }}>{c.status}</span>
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>{c.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Showing 5 of 24</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['‹', '1', '2', '3', '›'].map((p, i) => (
                    <button key={i} style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '5px', background: p === '1' ? '#265CFF' : 'white', color: p === '1' ? 'white' : '#64748b', fontSize: '12px', fontWeight: p === '1' ? 600 : 400, cursor: 'pointer' }}>{p}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Compliance donut */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Compliance status</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <svg viewBox="0 0 100 100" width="90" height="90">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" strokeWidth="14"
                      strokeDasharray="215.7 23.3" strokeDashoffset="0" strokeLinecap="butt"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="14"
                      strokeDasharray="5.9 233.1" strokeDashoffset="-215.7" strokeLinecap="butt"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="14"
                      strokeDasharray="5.9 233.1" strokeDashoffset="-221.6" strokeLinecap="butt"/>
                    <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">92%</text>
                    <text x="50" y="59" textAnchor="middle" fontSize="8" fill="#94a3b8">compliant</text>
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      {color:'#22c55e',label:'Compliant',value:'22'},
                      {color:'#f59e0b',label:'At risk',value:'1'},
                      {color:'#ef4444',label:'Non-compliant',value:'1'},
                    ].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
                        <span style={{ color: '#64748b', fontSize: '12px', flex: 1 }}>{s.label}</span>
                        <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 700 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Recent activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ACTIVITY.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#265CFF', marginTop: '5px', flexShrink: 0 }}/>
                      <div>
                        <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>{a.text}</p>
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </main>
    </div>
  )
}
