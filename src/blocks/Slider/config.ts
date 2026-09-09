import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const SliderBlock: Block = {
  slug: 'slider',
  labels: {
    singular: 'Slider',
    plural: 'Sliders',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'heading', type: 'text' },
        { name: 'text', type: 'textarea' },
        { name: 'buttonLabel', type: 'text' },
        { name: 'buttonUrl', type: 'text' },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
