import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getSiteSettings } from '@/lib/content'
import { mediaToUrl } from '@/lib/seo'

import '@/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  )

  try {
    const settings = await getSiteSettings()
    const favicon = mediaToUrl(settings?.favicon)
    return {
      metadataBase,
      icons: favicon
        ? {
            icon: [{ url: favicon }],
            shortcut: [{ url: favicon }],
            apple: [{ url: favicon }],
          }
        : undefined,
    }
  } catch {
    return { metadataBase }
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
