import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type { PageDocument, SiteSettingsDocument } from '@/lib/types'

// Site-specific fetchers (getProjects, getProjectBySlug, getTestimonials)
// are in src/_site-specific/lib/content.ts

// Cached at the data layer (Next's Data Cache via unstable_cache) rather than
// relying on the Full Route Cache: [slug] pages can't use generateStaticParams
// to opt into route-level ISR because the DB isn't available at Docker build
// time, so this is what actually keeps repeat requests off the database.
export const getSiteSettings = cache(
  unstable_cache(
    async (): Promise<SiteSettingsDocument | null> => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'site-settings',
        depth: 2,
        limit: 1,
        overrideAccess: false,
      })

      return (result.docs[0] as SiteSettingsDocument) || null
    },
    ['site-settings'],
    { tags: ['site-settings'], revalidate: 3600 },
  ),
)

export const getPageBySlug = cache(async (slug: string): Promise<PageDocument | null> => {
  // Tag must include the slug, and unstable_cache's tags are fixed at wrap
  // time, so the wrapper is built per call rather than once at module scope.
  const cached = unstable_cache(
    async (slug: string) => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        depth: 6,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return (result.docs[0] as PageDocument) || null
    },
    ['page-by-slug', slug],
    { tags: [`page:${slug}`], revalidate: 3600 },
  )

  return cached(slug)
})
