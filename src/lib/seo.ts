import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/content'
import type { MediaDocument } from '@/lib/types'

export const mediaToUrl = (media?: MediaDocument | string | null) => {
  if (!media) {
    return undefined
  }

  if (typeof media === 'string') {
    return media
  }

  return media.sizes?.og?.url || media.url
}

export const buildMetadata = async (options?: {
  title?: string
  description?: string
  canonicalUrl?: string
  image?: MediaDocument | string
  noIndex?: boolean
  noFollow?: boolean
}): Promise<Metadata> => {
  const settings = await getSiteSettings()

  const title = options?.title || settings?.siteName || ''
  const description = options?.description || settings?.siteTagline || ''

  const canonical = options?.canonicalUrl || settings?.seo?.canonicalUrl
  const image = mediaToUrl(options?.image || settings?.seo?.openGraphImage)

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: !options?.noIndex,
      follow: !options?.noFollow,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export const buildJsonLd = (options: {
  schemaType?: string
  title?: string
  description?: string
  url?: string
  image?: string
}): Record<string, unknown> | null => {
  if (!options.schemaType) return null

  return {
    '@context': 'https://schema.org',
    '@type': options.schemaType,
    name: options.title,
    description: options.description,
    url: options.url,
    ...(options.image ? { image: options.image } : {}),
  }
}
