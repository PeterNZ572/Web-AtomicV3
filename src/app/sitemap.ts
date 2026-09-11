import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/content'
import { getPageUrl, getRequestSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const baseUrl = await getRequestSiteUrl(settings?.seo?.canonicalUrl)

  // Site-specific collections (e.g. projects) should be added in the consuming site's sitemap.ts

  try {
    const payload = await getPayloadClient()

    const pagesResult = await payload.find({ collection: 'pages', limit: 200, depth: 0 })

    return pagesResult.docs.map((page: any) => ({
      url: getPageUrl(baseUrl, page.slug),
      lastModified: new Date(page.updatedAt),
    }))
  } catch {
    return []
  }
}
