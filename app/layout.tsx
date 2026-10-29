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
