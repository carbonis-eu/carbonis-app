// seed-navi-kb.mjs — inserts new Navi KB entries into navi_knowledge table
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Read .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')

const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1)
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const newEntries = [
  // calculator
  {
    category: 'calculator',
    question: 'How do I calculate my CBAM cost?',
    answer: 'Use the free Carbonis CBAM Calculator at carbonis.eu/calculator. Enter your product type (steel, aluminum, cement, fertilizer, electricity, or hydrogen), country of origin, and annual import volume in tonnes. The calculator shows your embedded CO2, current ETS price, and total annual CBAM certificate cost in euros. No registration required.'
  },
  {
    category: 'calculator',
    question: 'How much will CBAM cost me per tonne of steel?',
    answer: 'At current ETS price of approximately €65-75 per tonne CO2, and typical steel embedded emissions of 1.8-2.2 tCO2e per tonne, expect €120-165 in CBAM certificates per tonne of imported steel. Use our free calculator at carbonis.eu/calculator for your specific product and country.'
  },
  // registration
  {
    category: 'registration',
    question: 'How do I register on Carbonis?',
    answer: 'Go to carbonis.eu/register. Choose your role: Seller (free, for listing carbon certificates), PRO Compliance (€79/month, for CBAM declarations), or PRO Trading (€249/month, for active certificate trading). After email verification, complete your company profile with VAT number and EORI number. Setup takes under 5 minutes.'
  },
  {
    category: 'registration',
    question: 'What is the difference between Seller, PRO Compliance and PRO Trading?',
    answer: 'Seller account is free forever - you can list Guarantees of Origin, EUAs, or surplus CBAM certificates on the marketplace and pay only 1.5% when a sale completes. PRO Compliance at €79/month gives you the full CBAM declaration suite: quarterly reports, embedded emissions calculator, supplier data request tools, and XML export. PRO Trading at €249/month adds active certificate trading features on top of everything in PRO Compliance.'
  },
  // selling
  {
    category: 'selling',
    question: 'I have surplus carbon certificates. How do I sell them?',
    answer: 'Create a free Seller account at carbonis.eu/register. Upload your certificate documentation (GO registry export, ETS account statement, or CBAM certificate file). Set your asking price - we show you current market reference prices. Your listing goes live immediately to all registered buyers. Carbonis charges 1.5% only when your sale completes. No upfront fees, no minimum volumes.'
  },
  {
    category: 'selling',
    question: 'What certificates can I sell on Carbonis?',
    answer: 'You can sell Guarantees of Origin (GOs) from renewable energy production, surplus ETS allowances (EUAs) from industrial installations, and surplus CBAM certificates after annual reconciliation. All EU-registered certificate types are accepted.'
  },
  {
    category: 'selling',
    question: 'How long does it take to sell certificates on Carbonis?',
    answer: 'Average time to first buyer inquiry: 3-7 business days for GOs, 1-3 days for EUAs and CBAM certificates. Buyers on Carbonis are verified EU compliance officers and importers with active purchasing needs.'
  },
  // compliance
  {
    category: 'compliance',
    question: 'I missed CBAM quarterly reports. What should I do?',
    answer: 'File retroactively immediately. The EU CBAM Transitional Registry accepts late submissions. Penalties during the transitional phase are €10-50 per tonne of unreported goods. Carbonis PRO Compliance includes retroactive declaration support - input your historical import data and the system generates correct XML for each missed quarter.'
  },
  {
    category: 'compliance',
    question: 'What are the CBAM quarterly report deadlines?',
    answer: 'Reports are due 1 month after each quarter ends: Q1 (Jan-Mar) due April 30, Q2 (Apr-Jun) due July 31, Q3 (Jul-Sep) due October 31, Q4 (Oct-Dec) due January 31 of the following year. Reporting has been required since October 2023.'
  },
  {
    category: 'compliance',
    question: 'Does CBAM apply to my company?',
    answer: 'CBAM applies if you import steel, aluminum, cement, fertilizers, electricity, or hydrogen from countries outside the EU. Check your CN commodity codes against Annex I of EU Regulation 2023/956. If you are unsure, use our free CBAM Calculator to check your products.'
  },
  // market
  {
    category: 'market',
    question: 'What is a Guarantee of Origin (GO)?',
    answer: 'A Guarantee of Origin (GO) is an electronic certificate proving that 1 MWh of electricity was generated from a renewable energy source. GOs are issued by national bodies (e.g., Umweltbundesamt in Germany, URE in Poland) and used by companies to prove renewable energy use in sustainability reports and RE100 commitments. Current prices: €2-7 per MWh depending on technology and vintage.'
  },
  {
    category: 'market',
    question: 'Can I deduct carbon costs already paid in my supplier\'s country?',
    answer: 'Yes. If your supplier is in a country with a recognized carbon price, you can deduct it from your CBAM obligation. Countries where deduction applies: Switzerland (Swiss ETS, linked to EU ETS), Norway, Iceland, and Liechtenstein (EEA, full EU ETS participation). Turkey and most other supplier countries currently do not qualify.'
  }
]

async function main() {
  // Fetch existing questions
  const { data: existing, error: fetchError } = await supabase
    .from('navi_knowledge')
    .select('question')

  if (fetchError) {
    console.error('Error fetching existing entries:', fetchError.message)
    process.exit(1)
  }

  const existingQuestions = new Set((existing || []).map(r => r.question.trim().toLowerCase()))
  console.log(`Found ${existingQuestions.size} existing KB entries`)

  const toInsert = newEntries.filter(
    e => !existingQuestions.has(e.question.trim().toLowerCase())
  )

  if (toInsert.length === 0) {
    console.log('No new entries to insert — all already exist.')
    process.exit(0)
  }

  console.log(`Inserting ${toInsert.length} new entries...`)

  const { data, error: insertError } = await supabase
    .from('navi_knowledge')
    .insert(toInsert)
    .select('id, question, category')

  if (insertError) {
    console.error('Insert error:', insertError.message)
    process.exit(1)
  }

  console.log(`Successfully inserted ${data.length} entries:`)
  for (const row of data) {
    console.log(`  [${row.category}] ${row.question.slice(0, 60)}...`)
  }
}

main()
