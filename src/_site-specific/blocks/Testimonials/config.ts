import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../../../blocks/shared'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Testimonials Collection', value: 'collection' },
        { label: 'Manual Testimonials', value: 'manual' },
      ],
    },
    {
      name: 'testimonialItems',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'manualTestimonials',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'company', type: 'text' },
        { name: 'quote', type: 'textarea', required: true },
      ],
    },
    {
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Single Feature', value: 'single' },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
