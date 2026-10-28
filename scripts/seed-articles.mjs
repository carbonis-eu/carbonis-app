import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const get = (key) => env.match(new RegExp(`^${key}=(.+)$`, 'm'))?.[1]?.trim()

const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false }
})

const articles = [
  {
    title: 'CBAM Calculator: Calculate Your EU Carbon Import Cost in 3 Minutes',
    slug: 'cbam-calculator-calculate-carbon-import-cost',
    excerpt: 'How much will CBAM cost your business from 2026? Use the free Carbonis CBAM Calculator — enter your product, country of origin, and annual import volume. Get your liability in seconds.',
    content: `## Why You Need to Calculate Your CBAM Cost Now

The EU Carbon Border Adjustment Mechanism starts financial obligations in January 2026. That is less than 18 months away. Companies that calculate their exposure now have time to renegotiate supplier contracts, adjust pricing, and plan cash flow. Companies that wait until 2026 will face an unexpected bill.

## How the Carbonis CBAM Calculator Works

Our free calculator requires three inputs:
1. **Product type** — steel, aluminum, cement, fertilizer, electricity, or hydrogen
2. **Country of origin** — where your supplier is based
3. **Annual import volume** — in tonnes

The calculator returns:
- Your estimated embedded CO₂ (in tCO₂e)
- Live CBAM certificate cost at current ETS price
- Annual total CBAM liability in euros
- Country-specific deduction if applicable (e.g., Switzerland, Norway)

## Example Calculation: Steel from Turkey

A Polish importer bringing in 5,000 tonnes of hot-rolled steel from Turkey:
- Embedded emissions: 5,000 t × 1.89 tCO₂e/t = **9,450 tCO₂e**
- At ETS price €72/t: **€680,400 annual CBAM cost**
- Turkey has no recognized carbon price → no deduction

## What to Do With Your Result

If your CBAM liability is above €50,000/year, you need a compliance system in place before 2026. The Carbonis PRO Compliance plan handles everything: quarterly declarations, certificate purchasing, and registry submissions — for €79/month.

If your CBAM liability is under €50,000/year, the free tools may be sufficient. You can file quarterly reports manually through the EU CBAM Transitional Registry.

## Try the Calculator Now

[Use the free CBAM Calculator →](/calculator)

No registration required. Takes 3 minutes.`,
    category: 'how-to',
    author: 'Carbonis Team',
    hero_image_url: 'https://picsum.photos/seed/cbam-calculator/1200/400',
    tags: ['CBAM calculator', 'cost estimate', 'ETS', '2026'],
    geo_targets: ['DE', 'PL', 'FR', 'IT', 'NL', 'CS', 'RO'],
    reading_time_min: 4,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: 'How to Register on Carbonis: Step-by-Step Setup Guide',
    slug: 'how-to-register-carbonis-setup-guide',
    excerpt: 'Setting up your Carbonis account takes less than 5 minutes. This guide walks you through registration, role selection, and your first CBAM calculation.',
    content: `## Who Should Register on Carbonis?

Carbonis has three account types — choose the one that fits your role:

- **Seller**: You hold carbon certificates (GOs, EUAs, or CBAM surplus) and want to list them on the marketplace. Free forever.
- **PRO Compliance**: You import CBAM-covered goods and need to file declarations, track embedded emissions, and purchase certificates. €79/month.
- **PRO Trading**: You actively buy and sell carbon certificates as part of your business model. €249/month.

## Step 1: Create Your Account

Go to [carbonis.eu/register](/register). Enter your business email and create a password. You will receive a confirmation email — click the link to verify.

## Step 2: Select Your Role

After email verification, you will be asked to select your primary role. This determines which tools appear in your dashboard. You can change your role at any time from account settings.

## Step 3: Complete Your Company Profile

Add your:
- Company legal name and country of registration
- VAT number (required for certificate transactions)
- EORI number (required for CBAM declarations)

Your profile is used to pre-fill declaration forms and marketplace listings — saving you time on every transaction.

## Step 4: Set Up Your First Shipment (PRO Compliance)

If you selected PRO Compliance, add your first import shipment:
1. Select the product category (steel, aluminum, cement, etc.)
2. Enter the country of origin
3. Add your CN commodity code
4. Enter or import your embedded emissions data

Carbonis calculates your CBAM certificate requirement automatically.

## Step 5: List Your First Certificate (Seller)

If you selected Seller, click "Add Listing":
1. Select your certificate type (GO, EUA, or CBAM)
2. Upload your registry documentation
3. Set your asking price
4. Publish — your listing goes live immediately to all registered buyers

## Questions?

Ask Navi — our AI compliance assistant available in the bottom right corner of every page. Navi answers CBAM questions in your language, 24/7.`,
    category: 'platform',
    author: 'Carbonis Team',
    hero_image_url: 'https://picsum.photos/seed/carbonis-register/1200/400',
    tags: ['registration', 'setup', 'Carbonis', 'onboarding'],
    geo_targets: ['DE', 'PL', 'FR', 'IT', 'NL', 'CS', 'RO'],
    reading_time_min: 5,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: '5 Reasons EU Importers Choose Carbonis for CBAM Compliance',
    slug: 'why-choose-carbonis-cbam-compliance-platform',
    excerpt: 'CBAM compliance software is a new category. Here is why growing companies across the EU trust Carbonis to handle their carbon border obligations.',
    content: `## 1. Self-Service Tools That Actually Work

Carbonis does not sell consulting — it sells tools. Our declaration builder, emissions calculator, and supplier data request templates are designed so your team can handle CBAM compliance without external advisors. Most PRO users complete their first quarterly declaration in under 2 hours.

## 2. Live ETS Price Integration

Your CBAM certificate cost changes every week as the EU ETS carbon price moves. Carbonis shows you the current ETS price on your dashboard and in the CBAM calculator — so your cost estimates are always current, not based on last quarter's numbers.

## 3. The Only CBAM Compliance + Marketplace Platform

Other tools handle either compliance OR trading. Carbonis handles both. If you over-purchase CBAM certificates, you can list the surplus on our marketplace immediately — from the same dashboard, without switching tools or providers.

## 4. Multilingual Supplier Support

The hardest part of CBAM is getting embedded emissions data from your suppliers in Turkey, India, Ukraine, or Egypt. Carbonis generates supplier data request letters in the supplier's language — Turkish, Arabic, Ukrainian, Polish, and more — with calculation templates your supplier can fill in directly.

## 5. No Lock-In, Transparent Pricing

- **Seller**: Free forever. No hidden fees. 1.5% on completed transactions only.
- **PRO Compliance**: €79/month. Cancel anytime. No annual commitment required.
- **PRO Trading**: €249/month. Same cancellation terms.

No setup fees. No per-declaration charges. No minimum contract.

## Trusted by Compliance Officers Across the EU

Carbonis is used by importers in Germany, Poland, France, Italy, the Netherlands, and beyond. Our customer support team responds within 4 hours on business days — in English, German, Polish, and French.

[Start your free account →](/register)`,
    category: 'platform',
    author: 'Carbonis Team',
    hero_image_url: 'https://picsum.photos/seed/carbonis-reasons/1200/400',
    tags: ['Carbonis', 'CBAM compliance', 'platform', 'why choose'],
    geo_targets: ['DE', 'PL', 'FR', 'IT', 'NL', 'CS', 'RO'],
    reading_time_min: 5,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: 'CBAM Transitional Phase 2023–2025: What You Must Do Right Now',
    slug: 'cbam-transitional-phase-2023-2025-action-plan',
    excerpt: 'The CBAM transitional period ends December 31, 2025. Every EU importer of covered goods must be filing quarterly reports right now. Are you compliant?',
    content: `## The Transitional Phase Is Already Running

Many importers do not realize: CBAM reporting obligations started October 1, 2023. If you import steel, aluminum, cement, fertilizers, electricity, or hydrogen from outside the EU, you have been required to file quarterly reports since then.

Missing a quarterly report means fines of €10–€50 per tonne of unreported goods — even during the transitional phase where no financial obligation applies.

## What Is Required During the Transitional Phase (2023–2025)?

**Every quarter, you must report:**
- The total quantity of each CBAM good imported
- The country of origin
- The embedded direct and indirect greenhouse gas emissions
- The carbon price paid in the country of origin (if any)

**You do NOT need to:**
- Purchase CBAM certificates (this starts January 2026)
- Pay any carbon cost (the financial obligation is deferred)

## Quarterly Report Deadlines

| Quarter | Goods imported | Report due |
|---------|---------------|------------|
| Q4 2023 | Oct–Dec 2023 | Jan 31, 2024 ✓ |
| Q1 2024 | Jan–Mar 2024 | Apr 30, 2024 ✓ |
| Q2 2024 | Apr–Jun 2024 | Jul 31, 2024 ✓ |
| Q3 2024 | Jul–Sep 2024 | Oct 31, 2024 ✓ |
| Q4 2024 | Oct–Dec 2024 | Jan 31, 2025 |
| Q1 2025 | Jan–Mar 2025 | Apr 30, 2025 |

## What Happens If You Have Not Filed?

If you have missed reports, you can still file late — the EU CBAM Transitional Registry accepts retroactive submissions. File immediately to reduce penalty exposure.

## How Carbonis Helps You Catch Up

Carbonis PRO Compliance includes retroactive declaration support. Input your historical import data — the system generates the correct XML format for each missed quarter ready to submit to the EU registry.

[Start your compliance catch-up →](/register)`,
    category: 'regulation',
    author: 'Carbonis Team',
    hero_image_url: 'https://picsum.photos/seed/cbam-transitional/1200/400',
    tags: ['transitional phase', 'CBAM reporting', 'deadlines', '2025'],
    geo_targets: ['DE', 'PL', 'FR', 'IT', 'NL', 'CS', 'RO'],
    reading_time_min: 6,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: 'What Is a Guarantee of Origin (GO)? EU Green Energy Certificate Explained',
    slug: 'guarantee-of-origin-go-eu-green-energy-certificate-explained',
    excerpt: 'Guarantees of Origin prove your electricity came from renewable sources. Here is how GOs work, who issues them, how they are priced, and how to buy or sell them.',
    content: `## What Is a Guarantee of Origin?

A Guarantee of Origin (GO) is an electronic certificate that proves one megawatt-hour (MWh) of electricity was generated from a renewable energy source. GOs are the EU's standard instrument for tracking and proving green electricity — used by companies to substantiate renewable energy claims in sustainability reports, RE100 commitments, and corporate ESG disclosures.

One GO = one MWh of renewable electricity produced.

## Who Issues GOs?

GOs are issued by national issuing bodies designated under EU Directive 2018/2001 (the Renewable Energy Directive, or RED II). In Germany, it is the Umweltbundesamt. In Poland, the URE. Each GO carries a unique serial number, the production technology (solar, wind, hydro, biomass), and the production period.

## What Information Is On a GO?

Every GO certificate specifies:
- Energy source (wind onshore, wind offshore, solar PV, hydro, biomass, biogas)
- Country of production
- Production period (month and year)
- Production installation name and capacity
- Fuel inputs and CO₂ emissions factor
- Issuing body and certificate serial number

## How Are GOs Priced?

GO prices are set by supply and demand in the European market. Typical prices in 2024:
- **Nordic hydro GOs**: €0.30–€1.00/MWh (abundant supply)
- **Solar PV GOs**: €2.00–€4.00/MWh
- **Wind GOs**: €3.00–€5.00/MWh
- **Biomass GOs**: €4.00–€7.00/MWh

Prices rise when corporate demand for renewable energy claims increases (RE100 targets, sustainability reporting deadlines) and fall when new renewable capacity floods the market.

## Buy and Sell GOs on Carbonis

Carbonis marketplace is registered for GO trading. Sellers list certificates directly from their national registry export. Buyers receive full documentation for their sustainability reports.

[Browse GO listings on Carbonis →](/register)`,
    category: 'regulation',
    author: 'Carbonis Team',
    hero_image_url: 'https://picsum.photos/seed/green-energy-go/1200/400',
    tags: ['Guarantee of Origin', 'GO', 'renewable energy', 'green certificate'],
    geo_targets: ['DE', 'PL', 'FR', 'IT', 'NL', 'CS', 'RO'],
    reading_time_min: 6,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: 'Do You Have Surplus Carbon Certificates? Here Is How to Sell Them',
    slug: 'surplus-carbon-certificates-how-to-sell-eu',
    excerpt: 'Industrial companies, renewable energy producers, and CBAM importers often hold more carbon certificates than they need. Selling surplus on Carbonis takes minutes.',
    content: `## Why Companies End Up With Surplus Certificates

Carbon certificates accumulate in several situations:

**Renewable energy producers**: Every MWh you generate automatically earns a GO. Many producers hold thousands of unissued or unsold GOs from past months.

**Industrial ETS participants**: If your production dropped below your ETS allocation due to slowdown, restructuring, or efficiency improvements, you hold surplus EUAs that are pure cash value.

**CBAM importers**: After the annual CBAM reconciliation, importers who over-purchased certificates receive their surplus back from the registry — and can resell it.

## How Much Is Your Surplus Worth?

Use this quick estimate:
- **GOs**: Current spot price × number of certificates (typically €2–€7/MWh)
- **EUAs**: Current ETS spot price × tonnes (currently ~€65–€75/tonne)
- **CBAM certificates**: Current ETS weekly price × tCO₂e surplus

For a 10 MW solar plant running at 1,100 full-load hours per year, that is 11,000 GOs per year. At €3/MWh = **€33,000 in annual GO revenue**.

## List on Carbonis in 5 Minutes

1. Create a free Seller account at [carbonis.eu/register](/register)
2. Upload your certificate documentation
3. Set your asking price (Carbonis shows current market rates)
4. Go live — your listing reaches all registered buyers on the platform

No subscription needed. No upfront fees. Carbonis charges 1.5% only when your sale completes.

## What Documents Do You Need?

- **For GOs**: Export from your national GO registry (PDF or XML format accepted)
- **For EUAs**: Screenshot or export from your EU Registry account showing the balance
- **For CBAM certificates**: CBAM Registry surplus notification

## How Fast Do Certificates Sell?

Average time to first buyer inquiry on Carbonis: 3–7 business days for GOs, 1–3 days for EUAs and CBAM certificates (higher demand from compliance deadlines).

[List your certificates now — it is free →](/register)`,
    category: 'platform',
    author: 'Carbonis Team',
    hero_image_url: 'https://picsum.photos/seed/surplus-certificates/1200/400',
    tags: ['surplus certificates', 'sell GO', 'EUA', 'CBAM surplus'],
    geo_targets: ['DE', 'PL', 'FR', 'IT', 'NL', 'CS', 'RO'],
    reading_time_min: 5,
    is_published: true,
    published_at: new Date().toISOString(),
  },
]

const existing = (await supabase.from('articles').select('slug')).data?.map(a => a.slug) ?? []
const toInsert = articles.filter(a => !existing.includes(a.slug))

if (toInsert.length === 0) {
  console.log('All articles already exist.')
  process.exit(0)
}

const { data, error } = await supabase.from('articles').insert(toInsert).select('slug')
if (error) { console.error('Error:', error.message); process.exit(1) }
console.log(`Inserted ${data.length} articles:`, data.map(a => a.slug).join('\n  '))
