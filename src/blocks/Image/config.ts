import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Image',
    plural: 'Image Blocks',
  },
  fields: [
    contentBlockNameField,
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'altText', type: 'text' },
    { name: 'caption', type: 'text' },
    { name: 'linkUrl', type: 'text' },
    { name: 'newTab', type: 'checkbox', defaultValue: false },
    ...contentBlockAdvancedFields(),
  ],
}
