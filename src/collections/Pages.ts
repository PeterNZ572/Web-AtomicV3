import { revalidatePath, revalidateTag } from 'next/cache'
import type { Block, CollectionConfig } from 'payload'

import { createContentBuilderField } from '../fields/content-builder'
import { contentBlocks } from '../blocks'
import { seoField } from '../fields/seo'
import { editorsAndAdmins, publishedOrLoggedIn } from '../lib/access'
import { slugify } from '../lib/utils'

export const createPagesCollection = (additionalBlocks: Block[] = []): CollectionConfig => {
  const allBlocks = [...contentBlocks, ...additionalBlocks]
  return {
    slug: 'pages',
    access: {
      create: editorsAndAdmins,
      delete: editorsAndAdmins,
      read: publishedOrLoggedIn,
      update: editorsAndAdmins,
    },
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    },
    versions: {
      drafts: true,
    },
    hooks: {
      beforeValidate: [
        ({ data }) => {
          if (data && typeof data.title === 'string' && !data.slug) {
            data.slug = slugify(data.title)
          }
          return data
        },
      ],
      afterChange: [
        ({ doc, previousDoc }) => {
          const isOrWasPublished = doc._status === 'published' || previousDoc?._status === 'published'
          if (!isOrWasPublished) return doc

          try {
            revalidateTag(`page:${doc.slug}`)
            if (doc.slug === 'home') revalidatePath('/')
            if (previousDoc && previousDoc.slug !== doc.slug) {
              revalidateTag(`page:${previousDoc.slug}`)
              if (previousDoc.slug === 'home') revalidatePath('/')
            }
            revalidatePath('/sitemap.xml')
          } catch {
            // revalidatePath/revalidateTag throw outside a Next.js request context (e.g. seed/migration scripts)
          }

          return doc
        },
      ],
      afterDelete: [
        ({ doc }) => {
          try {
            revalidateTag(`page:${doc.slug}`)
            if (doc.slug === 'home') revalidatePath('/')
            revalidatePath('/sitemap.xml')
          } catch {
            // revalidatePath/revalidateTag throw outside a Next.js request context (e.g. seed/migration scripts)
          }

          return doc
        },
      ],
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Page Information',
            fields: [
              { name: 'title', type: 'text', required: true },
              {
                type: 'row',
                fields: [
                  { name: 'slug', type: 'text', required: true, unique: true },
                  { name: 'excerpt', type: 'textarea' },
                ],
              },
            ],
          },
          {
            label: 'Content Builder',
            fields: [createContentBuilderField(allBlocks)],
          },
          {
            label: 'SEO',
            fields: [seoField],
          },
        ],
      },
    ],
  }
}

// Used when not going through the plugin (e.g. direct import in tests or scripts)
export const Pages = createPagesCollection()
