export const instant = false

import { SiteHeader } from './components/landing/SiteHeader'
import { Hero } from './components/landing/Hero'
import { StatsBand } from './components/landing/StatsBand'
import { Features } from './components/landing/Features'
import { RegulationTimeline } from './components/landing/RegulationTimeline'
import { HowItWorks } from './components/landing/HowItWorks'
import { Sectors } from './components/landing/Sectors'
import { CalculatorSection } from './components/landing/CalculatorSection'
import { Faq } from './components/landing/Faq'
import { CtaBanner } from './components/landing/CtaBanner'
import { SiteFooter } from './components/landing/SiteFooter'

async function getEtsPrice(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/ets-price`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      return data.price ?? 65.4
    }
  } catch {
    /* fall back to reference price */
  }
  return 65.4
}

export default async function HomePage() {
  const etsPrice = await getEtsPrice()

  return (
    <>
      <SiteHeader />
      <main>
        <Hero etsPrice={etsPrice} />
        <StatsBand />
        <Features />
        <RegulationTimeline />
        <HowItWorks />
        <Sectors />
        <CalculatorSection etsPrice={etsPrice} />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  )
}
