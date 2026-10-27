-- Seed articles (drafts — publish manually via admin panel or set is_published = true)
insert into public.articles (slug, title, excerpt, content, category, author, reading_time_min, geo_targets, is_published) values

(
  'what-is-cbam-eu-carbon-border-adjustment',
  'What Is CBAM? The EU Carbon Border Adjustment Mechanism Explained',
  'The EU Carbon Border Adjustment Mechanism (CBAM) is a carbon pricing policy that applies to imports of certain goods from non-EU countries. Here is everything importers need to know.',
  E'## What Is CBAM?\n\nThe Carbon Border Adjustment Mechanism (CBAM) is an EU regulation that puts a carbon price on imports of certain goods from outside the European Union. It is established by **Regulation (EU) 2023/956** and entered its transitional phase on 1 October 2023.\n\n## Why Was CBAM Created?\n\nThe EU Emissions Trading System (ETS) already puts a price on carbon for EU producers. Without CBAM, importers of goods from countries with weaker or no carbon pricing would have a competitive advantage — a situation known as "carbon leakage." CBAM levels the playing field.\n\n## Which Goods Are Covered?\n\nCBAM currently covers six sectors under Annex I of Regulation 2023/956:\n\n- Cement\n- Iron and steel\n- Aluminium\n- Fertilisers\n- Electricity\n- Hydrogen\n\n## How Does It Work?\n\nImporters of CBAM goods must register as an authorised CBAM declarant, report the embedded greenhouse gas emissions of their imports quarterly, purchase CBAM certificates corresponding to the carbon price that would have been paid under EU ETS rules, and submit an annual CBAM declaration by 31 May each year.\n\n## Key Dates\n\nThe transitional period ran from October 2023 to December 2025, requiring quarterly reporting but no financial obligations. From 1 January 2026, full financial obligations apply, including the purchase and surrender of CBAM certificates.\n\n## Who Needs to Act?\n\nAny EU-based company that imports Annex I goods above the de minimis threshold must comply. Compliance is the responsibility of the importer — not the supplier.',
  'regulation',
  'Carbonis Team',
  6,
  ARRAY['DE', 'FR', 'PL', 'IT', 'NL'],
  false
),

(
  'cbam-declaration-guide-step-by-step',
  'How to File Your First CBAM Declaration: A Step-by-Step Guide',
  'CBAM quarterly declarations are mandatory for all EU importers of Annex I goods. This guide walks you through every field, every deadline, and every XML requirement.',
  E'## Before You Start\n\nTo file a CBAM declaration you need an EORI number, registration as an authorised CBAM declarant via the EU CBAM Registry (DG TAXUD), and embedded emissions data from your suppliers for each imported good.\n\n## Step 1 — Gather Embedded Emissions Data\n\nContact your non-EU suppliers and request the specific embedded greenhouse gas emissions per tonne of product, broken down by production process. The EU Commission has published a standard template for this data exchange.\n\n## Step 2 — Calculate Your CBAM Liability\n\nFor each shipment, multiply the embedded emissions (tCO2e) by the average EU ETS carbon price for the reporting period. If your supplier already paid a carbon price in their country, this can be deducted.\n\n## Step 3 — Access the EU CBAM Registry\n\nLog in to the EU CBAM Registry operated by DG TAXUD. All declarations are filed electronically through this system.\n\n## Step 4 — Complete the Declaration Fields\n\nEach quarterly declaration requires the CN (Combined Nomenclature) code of the goods, country of origin, net mass or quantity in the applicable unit, embedded direct and indirect emissions, and the carbon price already paid in the country of origin (if any).\n\n## Step 5 — Submit and Retain Records\n\nSubmit before the quarterly deadline. Retain all supporting documentation — supplier emissions reports, invoices, and calculation methodologies — for at least five years.\n\n## Common Mistakes to Avoid\n\n- Using estimated emissions without documenting the methodology\n- Forgetting indirect emissions for electricity-intensive goods\n- Missing the 31 May annual declaration deadline',
  'how-to',
  'Carbonis Team',
  8,
  ARRAY[]::text[],
  false
),

(
  'carbonis-platform-launch',
  'Introducing Carbonis: EU CBAM Compliance and Carbon Certificate Marketplace',
  'Carbonis is the first EU platform combining CBAM compliance tools with an OTC carbon certificate marketplace. Here is what we built and why.',
  E'## The Problem We Are Solving\n\nEU importers face a new regulatory reality: CBAM requires them to track embedded emissions, interact with suppliers across multiple countries, file quarterly reports, and purchase carbon certificates — all while their existing tools were built for a pre-CBAM world.\n\nAt the same time, companies with surplus CBAM certificates, Guarantees of Origin (GO), or EUAs have no efficient way to find buyers without going through expensive brokers.\n\n## What Carbonis Is\n\nCarbonis is a platform built for two groups:\n\n**For compliance teams and importers** — a self-service toolkit that covers the full CBAM workflow: embedded emissions calculation, supplier data requests, declaration building, and XML export in the format required by the EU CBAM Registry.\n\n**For certificate sellers** — a free OTC bulletin board where verified EU companies can list surplus certificates and connect directly with buyers, without broker fees or exchange commissions.\n\n## What Makes Carbonis Different\n\nMost existing solutions are either pure consulting services or data providers. Carbonis is a workflow platform — you do the work yourself, in a fraction of the time, with built-in validation at every step.\n\n## What Is Next\n\nWe are in early access. The platform is live, the compliance tools are being rolled out to PRO subscribers, and the marketplace is open to Seller registrations today — free, with no subscription required.',
  'platform',
  'Carbonis Team',
  4,
  ARRAY[]::text[],
  false
);
