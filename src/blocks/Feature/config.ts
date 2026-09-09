import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const FeatureBlock: Block = {
  slug: 'feature',
  labels: {
    singular: 'Feature',
    plural: 'Features',
  },
  fields: [
    contentBlockNameField,
    { name: 'title', type: 'text', label: 'Title' },
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      admin: {
        components: {
          Field: './app/(payload)/components/admin/TinyMCEField.tsx#TinyMCEField',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media',
    },
    ...contentBlockAdvancedFields(),
  ],
}
