import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const TIER_LABELS: Record<string, string> = {
  free: 'Free Trial',
  seller: 'Seller',
  pro_compliance: 'Pro Compliance',
  pro_trading: 'Pro Trading',
}

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Certificate Buyer',
  seller: 'Certificate Seller',
  compliance: 'Compliance Manager',
  admin: 'Admin',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const tier = profile?.tier ?? 'free'
  const role = profile?.role ?? 'buyer'
  const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null
  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="min-h-screen bg-[#FFFBF3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#0B2471]">Carbonis</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Trial banner */}
        {tier === 'free' && daysLeft !== null && (
          <div className="bg-[#0B2471] text-white rounded-xl px-6 py-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium">Free trial active</p>
              <p className="text-blue-200 text-sm">{daysLeft} days remaining</p>
            </div>
            <a
              href="/pricing"
              className="bg-white text-[#0B2471] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Upgrade
            </a>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.company_name ? `Welcome, ${profile.company_name}` : 'Welcome to Carbonis'}
          </h1>
          <p className="text-gray-500 mt-1">
            {ROLE_LABELS[role]} · {TIER_LABELS[tier]}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DashboardCard
            title="CBAM Calculator"
            description="Calculate your CBAM liability for imported goods"
            href="/cbam"
            badge="Coming soon"
            icon="🧮"
          />
          <DashboardCard
            title="Certificate Marketplace"
            description="Browse and trade CBAM, GO, EUA certificates"
            href="/marketplace"
            icon="📋"
          />
          <DashboardCard
            title="Compliance Reports"
            description="Generate CBAM XML reports and gap analysis"
            href="/compliance"
            badge="Pro"
            icon="📊"
          />
        </div>

        {/* Profile info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">Email</dt>
              <dd className="text-sm text-gray-900 mt-1">{user.email}</dd>
            </div>
            {profile?.company_name && (
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">Company</dt>
                <dd className="text-sm text-gray-900 mt-1">{profile.company_name}</dd>
              </div>
            )}
            {profile?.vat_number && (
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">VAT number</dt>
                <dd className="text-sm text-gray-900 mt-1">{profile.vat_number}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">Plan</dt>
              <dd className="text-sm text-gray-900 mt-1">{TIER_LABELS[tier]}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
  icon,
  badge,
}: {
  title: string
  description: string
  href: string
  icon: string
  badge?: string
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#265CFF] hover:shadow-sm transition-all block"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </a>
  )
}
