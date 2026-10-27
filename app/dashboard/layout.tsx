export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from './_components/DashboardSidebar'

function getFirstName(email: string) {
  const local = email.split('@')[0]
  const part = local.split(/[._-]/)[0]
  return part.charAt(0).toUpperCase() + part.slice(1)
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, role, tier, trial_ends_at')
    .eq('id', user.id)
    .single()

  // Check role from app_metadata (JWT) first, fall back to profiles table
  const metaRole = (user.app_metadata as Record<string, string> | null)?.role
  if (metaRole === 'admin' || profile?.role === 'admin') redirect('/admin')

  const firstName = getFirstName(user.email ?? 'there')
  const companyName = profile?.company_name ?? 'Your Company'
  const tier = profile?.tier ?? 'free'
  const initials = firstName.slice(0, 2).toUpperCase()
  const isTrial = tier === 'free'
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 30

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', overflow: 'hidden', background: '#f1f5f9' }}>
      <DashboardSidebar
        companyName={companyName}
        initials={initials}
        tier={tier}
        isTrial={isTrial}
        trialDaysLeft={trialDaysLeft}
      />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
