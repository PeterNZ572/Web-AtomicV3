import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/content'
import { getPageUrl, getRequestSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const baseUrl = await getRequestSiteUrl(settings?.seo?.canonicalUrl)

  try {
    const payload = await getPayloadClient()

    const [pagesResult, projectsResult] = await Promise.all([
      payload.find({ collection: 'pages', limit: 200, depth: 0 }),
      payload.find({
        collection: 'projects',
        limit: 200,
        depth: 0,
        where: { _status: { equals: 'published' } },
      }),
    ])

    return [
      ...pagesResult.docs.map((page: any) => ({
        url: getPageUrl(baseUrl, page.slug),
        lastModified: new Date(page.updatedAt),
      })),
      ...(projectsResult.docs.length
        ? [{ url: `${baseUrl}/projects`, lastModified: new Date() }]
        : []),
      ...projectsResult.docs.map((project: any) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt),
      })),
    ]
  } catch {
    return []
  }
}
