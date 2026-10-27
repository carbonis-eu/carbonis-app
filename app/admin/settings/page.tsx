export const dynamic = 'force-dynamic'

const Info = ({ text }: { text: string }) => (
  <span title={text} style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#94a3b8" strokeWidth="1.2"/><path d="M7 6v4M7 4.5v-.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
  </span>
)

const Field = ({ label, value, info }: { label: string; value: string; info?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {info && <Info text={info} />}
    </div>
    <div style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#334155' }}>{value}</div>
  </div>
)

export default function AdminSettingsPage() {
  return (
    <div style={{ padding: '32px 28px', maxWidth: '640px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Platform configuration. Changes require a code deployment.</p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Platform</h3>
        <Field label="Platform name" value="Carbonis" />
        <Field label="Contact email" value="info@carbonis.eu" info="Only this email is approved for public use. Never use sales@carbonis.eu." />
        <Field label="Domain" value="carbonis.eu" />
        <Field label="Trial period" value="30 days" info="Free trial duration for all new registrations." />
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Early Bird Program</h3>
        <Field label="Early Bird price (PRO Trading)" value="€1,990 / year" info="Special founding member price. Regular annual price: €2,490." />
        <Field
          label="Early Bird slots remaining"
          value="10 of 10 available"
          info="Update this manually when a founding member signs up. Stripe automation planned for v2."
        />
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#92400e' }}>
          ⚠️ Slots are tracked manually until Stripe is configured. Update this count when issuing Xolo Go invoices.
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Pricing</h3>
        <Field label="PRO Compliance" value="€79 / month · €790 / year" />
        <Field label="PRO Trading" value="€249 / month · €2,490 / year" />
        <Field label="Seller" value="Free forever" />
      </div>
    </div>
  )
}
