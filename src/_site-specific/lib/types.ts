import type { TestimonialDocument } from '@/lib/types'

export type ProjectDocument = {
  id: string
  title: string
  slug: string
  client: string
  industry?: string
  summary: string
  featured?: boolean
  services?: { item?: string }[] | string[]
  results?: { value?: string; label?: string }[]
  heroImage?: import('@/lib/types').MediaDocument | string
  gallery?: (import('@/lib/types').MediaDocument | string)[]
  challenge?: unknown
  solution?: unknown
  outcome?: unknown
  testimonial?: TestimonialDocument | string
  seo?: import('@/lib/types').SeoFields
}
