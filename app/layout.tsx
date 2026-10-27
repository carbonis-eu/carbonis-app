import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NaviWidget from "./components/NaviWidget";
import FoundingMemberPopup from "./components/FoundingMemberPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://carbonis.eu'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Carbonis — EU CBAM Compliance & Carbon Certificate Marketplace',
    template: '%s | Carbonis',
  },
  description: 'Calculate your EU CBAM carbon border adjustment liability instantly. Compare sourcing alternatives, trade CBAM and GO certificates, and generate audit-ready declarations for EU Regulation 2023/956.',
  keywords: ['CBAM', 'carbon border adjustment mechanism', 'EU ETS', 'CBAM compliance', 'carbon certificate', 'emission allowance', 'EU 2023/956', 'carbon marketplace', 'CBAM declaration', 'CBAM calculator'],
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
    locale: 'en_EU',
    url: APP_URL,
    siteName: 'Carbonis',
    title: 'Carbonis — EU CBAM Compliance & Carbon Certificate Marketplace',
    description: 'Calculate EU CBAM liability instantly. Trade carbon certificates. Generate audit-ready declarations. Built for EU importers and compliance teams.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Carbonis CBAM Compliance Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbonis — EU CBAM Compliance',
    description: 'Calculate EU CBAM carbon border adjustment liability. Trade CBAM certificates. Audit-ready declarations.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'en':         APP_URL,
      'de':         APP_URL,
      'fr':         APP_URL,
      'pl':         APP_URL,
      'it':         APP_URL,
      'nl':         APP_URL,
      'cs':         APP_URL,
      'ro':         APP_URL,
      'x-default':  APP_URL,
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
              description: 'EU CBAM compliance platform — calculate carbon border adjustment liability, trade certificates, generate declarations.',
              url: APP_URL,
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Free tier available for certificate sellers',
              },
              provider: {
                '@type': 'Organization',
                name: 'Carbonis',
                url: APP_URL,
              },
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}<NaviWidget /><FoundingMemberPopup /></body>
    </html>
  );
}
