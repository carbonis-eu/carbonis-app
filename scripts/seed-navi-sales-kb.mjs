/**
 * seed-navi-sales-kb.mjs
 * Sales & conversion-focused KB entries for Navi.
 * Run: node scripts/seed-navi-sales-kb.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const SALES_KB = [
  // ── FOUNDING MEMBER (urgency + scarcity) ────────────────────────────────
  {
    category: 'sales',
    question: 'Is there a special offer or discount for early customers?',
    answer: 'Yes — the Founding Member deal is active right now. The first 10 companies get PRO Trading at 1,990 €/year, locked in forever (normally 2,490 €/year). You save 500 € every year, as long as you stay subscribed. Only a handful of spots are left. Claim yours at carbonis.eu/pricing.',
  },
  {
    category: 'sales',
    question: 'What is the Founding Member deal?',
    answer: 'Founding Member means you lock in PRO Trading — our most complete plan — at 1,990 €/year forever. The regular price is 2,490 €/year. We offer this to the first 10 companies only. It includes CBAM + ETS compliance tools, OTC trading board, ETS cost tracker with MSR alerts, EFET contract generation, and priority support. Price never increases for you. Start with a 30-day free trial, no credit card needed.',
  },
  {
    category: 'sales',
    question: 'How many Founding Member spots are left?',
    answer: "We started with 10 Founding Member spots at 1,990 €/year (vs. 2,490 regular). A few have already been claimed. I can't tell you the exact remaining count in real time, but once all 10 are gone, this price is gone forever. If you're considering it, now is the right moment — go to carbonis.eu/pricing to check availability.",
  },
  {
    category: 'sales',
    question: 'Why should I sign up now instead of waiting?',
    answer: "CBAM quarterly reporting obligations are active now — penalties for non-compliance can reach €50 per tonne of CO₂. Every quarter you delay is a quarter where you're exposed. Plus, the Founding Member price (1,990 €/year) disappears once 10 spots are taken. Early movers also get a head start on OTC trading before the market gets crowded. Register free and explore the platform risk-free.",
  },

  // ── LOGIN / REGISTRATION CTA ─────────────────────────────────────────────
  {
    category: 'sales',
    question: 'How do I get started?',
    answer: 'Create a free account at carbonis.eu — takes 2 minutes, no credit card. Once inside, you can run the CBAM calculator, explore the certificate marketplace, and see exactly which plan fits your situation. If you are an importer of steel, cement, aluminium, fertilisers, electricity, or hydrogen into the EU, you almost certainly need CBAM compliance tools.',
  },
  {
    category: 'sales',
    question: 'Do I need to pay to try Carbonis?',
    answer: "No. The Seller plan is completely free, forever — list your surplus carbon certificates at no cost. PRO plans come with a 30-day free trial, no credit card required. You only pay if you decide to stay after the trial. Register now at carbonis.eu and explore everything before committing.",
  },
  {
    category: 'sales',
    question: 'I want to log in or create an account',
    answer: 'Go to carbonis.eu/login to sign in, or carbonis.eu/register to create a new account. Registration is free and takes about 2 minutes. Once logged in, you get access to the CBAM calculator, compliance dashboard, and certificate marketplace. Need help? Just ask me anything.',
  },

  // ── PLAN UPSELL / COMPARISON ─────────────────────────────────────────────
  {
    category: 'sales',
    question: 'Which plan is right for me?',
    answer: 'Quick guide: if you only want to sell surplus certificates, the free Seller plan is enough. If you import goods into the EU and need CBAM compliance (calculator, declarations, audit reports), choose PRO Compliance at 79 €/month. If you also want to trade certificates on the OTC board and use ETS cost tools, go PRO Trading at 249 €/month — or 1,990 €/year with the Founding Member deal. Still unsure? Tell me what you import and I can be more specific.',
  },
  {
    category: 'sales',
    question: 'What is the difference between PRO Compliance and PRO Trading?',
    answer: 'PRO Compliance (79 €/month) covers CBAM obligations: calculator, XML declarations, audit-ready reports, sourcing comparison. PRO Trading (249 €/month or 1,990 €/year Founding price) adds everything in Compliance PLUS the OTC bulletin board (the only EU-wide one), ETS cost tracker with MSR alerts, and EFET contract auto-generation — for companies that want to actively trade carbon positions. The Founding Member deal makes PRO Trading cheaper than PRO Compliance for the first year if you lock in now.',
  },
  {
    category: 'sales',
    question: 'Is the annual plan cheaper than monthly?',
    answer: 'Significantly. PRO Compliance: 79 €/month vs. 790 €/year (save ~1 month free). PRO Trading: 249 €/month vs. 2,490 €/year (save ~1 month free). And with the Founding Member deal, PRO Trading drops to just 1,990 €/year — that is the cheapest it will ever be. Annual billing is always the smart choice for compliance tools you will need year-round.',
  },

  // ── ROI / BUSINESS CASE ──────────────────────────────────────────────────
  {
    category: 'sales',
    question: 'Is Carbonis worth the cost? What is the ROI?',
    answer: 'Consider: a CBAM penalty can reach €50 per tonne of CO₂ embedded in imports. A medium-sized steel importer moving 1,000 tonnes/year faces potential exposure of €50,000+ for one missed quarter. PRO Compliance costs 790 €/year. The ROI calculation is straightforward. Beyond penalty avoidance, our sourcing comparison tool often finds 10-20% cheaper green supply chain options — savings that far exceed the subscription cost.',
  },
  {
    category: 'sales',
    question: 'What happens if I do not comply with CBAM?',
    answer: 'EU Regulation 2023/956 sets penalties of up to €50 per tonne of CO₂ for importers who fail to report or surrender CBAM certificates. Quarterly reporting is mandatory since Q1 2024 for steel, cement, aluminium, fertilisers, electricity, and hydrogen. Non-compliance also risks customs delays and reputational damage with EU buyers. Carbonis makes quarterly declarations straightforward — generate your XML report in minutes.',
  },
  {
    category: 'sales',
    question: 'Can Carbonis help me reduce my CBAM costs, not just report them?',
    answer: 'Absolutely — that is actually where most clients find the biggest value. The sourcing comparison tool shows you which suppliers in which countries produce goods with lower embedded carbon, so you pay fewer CBAM certificates. Some clients reduce their CBAM liability by 15-30% just by adjusting supplier choice. PRO Compliance and PRO Trading both include this tool.',
  },

  // ── TRUST / OBJECTION HANDLING ───────────────────────────────────────────
  {
    category: 'sales',
    question: 'Is Carbonis a reliable platform? Who is behind it?',
    answer: 'Carbonis is a purpose-built EU CBAM compliance and carbon certificate marketplace. The platform is live at carbonis.eu, built for EU importers who need audit-ready CBAM compliance tools. We focus exclusively on the EU carbon regulatory space — CBAM, ETS, Guarantees of Origin. For specific company registration details, visit carbonis.eu/about or contact us at info@carbonis.eu.',
  },
  {
    category: 'sales',
    question: 'I am worried about data security and GDPR',
    answer: 'Carbonis is built on Supabase (hosted on AWS EU-West), complies with GDPR, and stores all data within the European Economic Area. We do not sell or share your data with third parties. Your CBAM calculations and compliance documents are private to your account. If you have specific data processing questions, contact info@carbonis.eu.',
  },
  {
    category: 'sales',
    question: 'How is Carbonis different from doing CBAM manually or with a consultant?',
    answer: 'A CBAM consultant charges €2,000-10,000+ per year for what Carbonis automates for 790 €/year. Manual spreadsheet work takes days per quarter and is error-prone — a single mistake in embedded carbon calculation can trigger an audit. Carbonis generates audit-ready XML declarations automatically, tracks regulation changes, and alerts you to deadlines. It is the difference between a full-time compliance headache and a 30-minute quarterly task.',
  },

  // ── QUICK ENGAGEMENT ─────────────────────────────────────────────────────
  {
    category: 'sales',
    question: 'What can I do with a free account?',
    answer: 'With a free Seller account you can: list surplus carbon certificates for sale, browse the certificate marketplace, and use the basic CBAM calculator. Upgrade to PRO at any time with a 30-day free trial. Register at carbonis.eu — it takes 2 minutes and no credit card.',
  },
  {
    category: 'sales',
    question: 'I have a question about pricing',
    answer: 'Carbonis has three plans: Seller (free forever — for listing certificates), PRO Compliance (79 €/month or 790 €/year — for CBAM declaration and compliance tools), and PRO Trading (249 €/month or 2,490 €/year — adds OTC trading and ETS tools). Right now there is a Founding Member deal: first 10 companies get PRO Trading at 1,990 €/year, locked in forever. See all details at carbonis.eu/pricing.',
  },
  {
    category: 'sales',
    question: 'Can I speak to someone or get a demo?',
    answer: 'Yes — email us at info@carbonis.eu to schedule a demo or ask any detailed questions. For quick answers, I am Navi and I am here 24/7. If you want to explore the platform yourself first, create a free account at carbonis.eu — no commitment, no credit card.',
  },
]

async function main() {
  // Fetch existing questions to avoid duplicates
  const { data: existing } = await supabase
    .from('navi_knowledge')
    .select('question')

  const existingSet = new Set((existing ?? []).map(e => e.question.toLowerCase().slice(0, 60)))

  const toInsert = SALES_KB.filter(e => {
    const key = e.question.toLowerCase().slice(0, 60)
    return !existingSet.has(key)
  })

  if (toInsert.length === 0) {
    console.log('All sales KB entries already exist, nothing to insert.')
    return
  }

  const entries = toInsert.map(e => ({ ...e, is_active: true }))
  const { data, error } = await supabase.from('navi_knowledge').insert(entries).select()

  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }

  console.log(`Successfully inserted ${data.length} sales KB entries:`)
  data.forEach(e => console.log(`  [${e.category}] ${e.question.slice(0, 60)}...`))
}

main()
