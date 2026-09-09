import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const TextBlock: Block = {
  slug: 'text',
  labels: {
    singular: 'Text',
    plural: 'Text Blocks',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        components: {
          Field: './app/(payload)/components/admin/TinyMCEField.tsx#TinyMCEField',
        },
      },
    },
    ...contentBlockAdvancedFields(),
  ],
}
