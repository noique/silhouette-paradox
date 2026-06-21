import type { Metadata } from 'next'
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
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
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
      </body>
    </html>
  )
}
