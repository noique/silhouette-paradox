import type { Metadata } from 'next'
import Script from 'next/script'
import { serif, sans } from '@/styles/fonts'
import GSAPProvider from '@/components/providers/GSAPProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Silhouette Paradox | DTC Dark Data Report',
  description:
    'An interactive data narrative exposing the hidden financial hemorrhage behind North American DTC women\'s apparel brands. When luxury aesthetics mask unit economics destruction.',
  openGraph: {
    title: 'The Silhouette Paradox',
    description: 'When luxury aesthetics mask financial hemorrhage — a DTC dark data report',
    type: 'website',
    siteName: 'The Silhouette Paradox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Silhouette Paradox',
    description: 'When luxury aesthetics mask financial hemorrhage — a DTC dark data report',
  },
  // Set NEXT_PUBLIC_SITE_URL to your own domain at BUILD time (see .env.deploy in
  // DEPLOY.md) so OG/Twitter/canonical URLs point at your server. The fallback is a
  // harmless local placeholder — intentionally NOT the old (decommissioned) Vercel URL.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:39000'
  ),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <GSAPProvider>
          {children}
        </GSAPProvider>
        {/* Umami analytics — only injected when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set
            at build time (see .env.deploy). website-id is a public value. */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://stats.noq.us/script.js'}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </body>
    </html>
  )
}
