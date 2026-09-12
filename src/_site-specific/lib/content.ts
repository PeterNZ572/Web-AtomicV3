import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type { TestimonialDocument } from '@/lib/types'
import type { ProjectDocument } from './types'

export const getProjects = cache(
  async (options?: { featured?: boolean; limit?: number }): Promise<ProjectDocument[]> => {
    const payload = await getPayloadClient()

    // The local API runs with overrideAccess, so the collection's
    // publishedOrLoggedIn rule doesn't apply here — drafts must be excluded
    // explicitly or unpublished projects leak onto the public site.
    const where = {
      _status: { equals: 'published' },
      ...(typeof options?.featured === 'boolean'
        ? {
            featured: {
              equals: options.featured,
            },
          }
        : {}),
    }

    const result = await payload.find({
      collection: 'projects',
      depth: 2,
      limit: options?.limit ?? 12,
      where,
      sort: '-updatedAt',
    })

    return result.docs as ProjectDocument[]
  },
)

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDocument | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    depth: 3,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
      _status: {
        equals: 'published',
      },
    },
  })

  return (result.docs[0] as ProjectDocument) || null
})

export const getTestimonials = cache(
  async (options?: { featured?: boolean; limit?: number }): Promise<TestimonialDocument[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'testimonials',
      depth: 2,
      limit: options?.limit ?? 6,
      sort: '-updatedAt',
      where:
        typeof options?.featured === 'boolean'
          ? {
              featured: {
                equals: options.featured,
              },
            }
          : undefined,
    })

    return result.docs as TestimonialDocument[]
  },
)
