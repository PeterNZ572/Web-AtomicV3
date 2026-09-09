import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'

import { adminsOnly, editorsAndAdmins } from '../lib/access'

const canCreateSingleton = async ({ req }: { req: any }) => {
  const existing = await req.payload.find({
    collection: 'site-settings',
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })

  return existing.totalDocs === 0
}

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  access: {
    create: canCreateSingleton,
    delete: adminsOnly,
    read: () => true,
    update: editorsAndAdmins,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'layout')
          revalidateTag('site-settings')
        } catch {
          // revalidatePath/revalidateTag throw outside a Next.js request context (e.g. seed/migration scripts)
        }
      },
    ],
  },
  admin: {
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'updatedAt'],
    description: 'Single global document for branding, navigation, contact details, and site-wide CSS.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'siteName', type: 'text', required: true },
            { name: 'siteTagline', type: 'text' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'primaryNavigation',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true },
              ],
            },
            {
              name: 'footerNavigation',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'announcement', type: 'textarea' },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea' },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'platform', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            { name: 'footerBlurb', type: 'textarea' },
          ],
        },
        {
          label: 'Global CSS',
          fields: [
            {
              name: 'globalCustomCss',
              type: 'textarea',
              admin: {
                description: 'Rendered on the frontend site-wide.',
              },
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'ga4MeasurementId',
              type: 'text',
              admin: {
                description: 'Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX). Leave blank to disable GA4.',
                placeholder: 'G-XXXXXXXXXX',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: false,
              admin: {
                description: 'Site Name and Tagline (Brand tab) are used as the default SEO title and description.',
              },
              fields: [
                {
                  name: 'openGraphImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Open Graph Image',
                  admin: {
                    description: 'Default OG image for social sharing across the site.',
                  },
                },
                {
                  name: 'canonicalUrl',
                  type: 'text',
                  label: 'Canonical URL',
                  admin: {
                    description: 'Base canonical URL for the site (e.g. https://example.com).',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
