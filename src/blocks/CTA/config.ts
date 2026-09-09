import type { Block } from 'payload'

import { buttonStyleOptions, contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'CTA',
    plural: 'CTAs',
  },
  fields: [
    contentBlockNameField,
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonUrl', type: 'text' },
    { name: 'style', type: 'select', defaultValue: 'primary', options: [...buttonStyleOptions] },
    ...contentBlockAdvancedFields(),
  ],
}
