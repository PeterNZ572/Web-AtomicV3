import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/content'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const baseUrl =
    settings?.seo?.canonicalUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000'

  // Site-specific collections (e.g. projects) should be added in the consuming site's sitemap.ts

  try {
    const payload = await getPayloadClient()

    const pagesResult = await payload.find({ collection: 'pages', limit: 200, depth: 0 })

    return pagesResult.docs.map((page: any) => ({
      url: page.slug === 'home' ? `${baseUrl}/` : `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
    }))
  } catch {
    return []
  }
}
