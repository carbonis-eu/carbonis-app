import { NextRequest, NextResponse } from 'next/server'

const EMAIL_TEMPLATES = {
  supply_sl: (company: string, surplus: number | null) => ({
    subject: `Carbonis: Prodajte presežne EUA certifikate brez posrednikov`,
    prompt: `Napiši kratek, profesionalen email v slovenščini za B2B outreach.
Podjetje: ${company}
Sektor: energetika / industrija
Namen: Vabilo k prodaji presežnih ETS certifikatov (EUA) prek Carbonis platforme.
${surplus ? `Ocenjeni presežek: ${surplus.toLocaleString()} EUA` : ''}

Platforma Carbonis (carbonis.eu):
- Brezplačna registracija za prodajalce
- OTC bulletin board — objaviš ponudbo, kupec te kontaktira direktno
- Ni posrednika, ni provizije — samo SaaS platforma
- EFET pogodba generirana avtomatsko
- Ustrezno za CBAM certifikate, Jamstva o poreklu (GO), EUA po pravnem mnenju

Email naj bo:
- Max 120 besed
- Brez "odlično", "super", "seveda" ali podobnih besed
- Konkreten: ena jasna CTA (registracija na carbonis.eu)
- Profesionalen ton za CFO / sustainability managerja
- Uvod z imenom podjetja, ne "Spoštovani"
- Brez izmišljenih podatkov ali obljub

Vrni SAMO telo emaila (brez zadeve). Brez podpisa — dodamo ga ločeno.`,
  }),
  supply_de: (company: string, surplus: number | null) => ({
    subject: `Carbonis: EUA-Überschüsse direkt verkaufen – ohne Zwischenhändler`,
    prompt: `Schreibe eine kurze, professionelle B2B-E-Mail auf Deutsch.
Unternehmen: ${company}
Zweck: Einladung zum Verkauf von ETS-Zertifikaten (EUA) über die Carbonis-Plattform.
${surplus ? `Geschätzter Überschuss: ${surplus.toLocaleString()} EUA` : ''}
Carbonis (carbonis.eu): Kostenlose Registrierung für Verkäufer, OTC-Marktplatz, keine Provision, EFET-Vertrag automatisch generiert.
Max 100 Wörter. Kein "Sehr geehrte Damen und Herren" — direkt mit Unternehmensname. Nur E-Mail-Body (kein Betreff, keine Signatur).`,
  }),
  supply_en: (company: string, surplus: number | null) => ({
    subject: `Carbonis: Sell surplus EUA certificates directly — no broker fees`,
    prompt: `Write a short, professional B2B outreach email in English.
Company: ${company}
Purpose: Invitation to list surplus EU ETS certificates (EUA) on Carbonis platform.
${surplus ? `Estimated surplus: ${surplus.toLocaleString()} EUA` : ''}
Carbonis (carbonis.eu): Free seller registration, OTC bulletin board, no commission, auto-generated EFET contract.
Max 100 words. Start with company name, not "Dear Sir/Madam". Email body only (no subject, no signature).`,
  }),
  demand_sl: (company: string) => ({
    subject: `CBAM obveznost 2026 — brezplačen izračun za ${company}`,
    prompt: `Napiši kratek email v slovenščini za CBAM uvoznika.
Podjetje: ${company}
Namen: Opozorilo na CBAM obveznosti 2026 + povabilo k brezplačnemu izračunu na Carbonis.
Carbonis: brezplačen CBAM kalkulator, compliance dashboard, XML export za EU CBAM Registry, PRO paket od 79€/mes.
Max 100 besed. Profesionalen ton. Samo body, brez zadeve in podpisa.`,
  }),
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const { company_name, language = 'sl', sector, estimated_surplus, type = 'supply' } = await request.json() as {
    company_name: string
    language?: string
    sector?: string
    estimated_surplus?: number | null
    type?: 'supply' | 'demand'
  }

  if (!company_name) return NextResponse.json({ error: 'company_name required' }, { status: 400 })

  const templateKey = `${type}_${language}` as keyof typeof EMAIL_TEMPLATES
  const templateFn = EMAIL_TEMPLATES[templateKey] ?? EMAIL_TEMPLATES.supply_en
  const { subject, prompt } = (templateFn as (c: string, s: number | null) => { subject: string; prompt: string })(company_name, estimated_surplus ?? null)

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
      }),
    }
  )

  if (!res.ok) return NextResponse.json({ error: 'Generation failed' }, { status: 502 })
  const data = await res.json()
  const body = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  return NextResponse.json({ subject, body })
}
