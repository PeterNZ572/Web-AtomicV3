import type { CollectionConfig } from 'payload'

import { editorsAndAdmins, publishedOrLoggedIn } from '../../lib/access'
import { seoField } from '../../fields/seo'
import { slugify } from '../../lib/utils'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: editorsAndAdmins,
    delete: editorsAndAdmins,
    read: publishedOrLoggedIn,
    update: editorsAndAdmins,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'featured', '_status'],
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
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'slug', type: 'text', required: true, unique: true },
                { name: 'client', type: 'text', required: true },
                { name: 'industry', type: 'text' },
              ],
            },
            { name: 'summary', type: 'textarea', required: true },
            { name: 'featured', type: 'checkbox', defaultValue: false },
            {
              name: 'services',
              type: 'array',
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            {
              name: 'results',
              type: 'array',
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            { name: 'challenge', type: 'richText' },
            { name: 'solution', type: 'richText' },
            { name: 'outcome', type: 'richText' },
            {
              name: 'testimonial',
              type: 'relationship',
              relationTo: 'testimonials',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoField],
        },
      ],
    },
  ],
}
