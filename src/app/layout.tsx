import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getSiteSettings } from '@/lib/content'
import { mediaToUrl } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'

import '@/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(getSiteUrl())

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
