import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import VeraWidget from "./components/VeraWidget";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://carbonis.eu'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Carbonis — Vaše stranke se vračajo same',
    template: '%s | Carbonis',
  },
  description: 'Sistem ki reaktivira stare stranke, zapolni urnik in skrbi za vaš ugled online — medtem ko vi delate tisto v čemer ste najboljši.',
  keywords: ['reaktivacija strank', 'Google ocene', 'booking sistem', 'lokalno podjetje', 'avtoservis stranke', 'fitnes stranke', 'kozmetika salon', 'Slovenia', 'Hrvaška'],
  authors: [{ name: 'Carbonis', url: APP_URL }],
  creator: 'Carbonis',
  publisher: 'Carbonis',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'sl_SI',
    url: APP_URL,
    siteName: 'Carbonis',
    title: 'Carbonis — Vaše stranke se vračajo same',
    description: '15–25% starih strank se vrne. 4,8★ povprečna ocena. 30 dni do prvih rezultatov. Za lokalna podjetja v Sloveniji in Hrvaški.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Carbonis — reaktivacija strank' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbonis — Vaše stranke se vračajo same',
    description: 'Sistem ki reaktivira stare stranke in zapolni urnik. Za avtoservise, salone, fitnes, gostince.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'sl': APP_URL,
      'hr': APP_URL,
      'x-default': APP_URL,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B2471',
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sl"
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Carbonis',
              applicationCategory: 'BusinessApplication',
              description: 'AI-powered marketing automation za lokalna podjetja v Sloveniji in Hrvaški. Reaktivacija strank, Google ocene, booking sistem.',
              url: APP_URL,
              operatingSystem: 'Web',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: '149',
                offerCount: '3',
                description: 'Starter, Growth, Pro paketi za lokalna podjetja',
              },
              provider: {
                '@type': 'Organization',
                name: 'Carbonis',
                url: APP_URL,
              },
              areaServed: ['SI', 'HR'],
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}<VeraWidget /></body>
    </html>
  );
}
