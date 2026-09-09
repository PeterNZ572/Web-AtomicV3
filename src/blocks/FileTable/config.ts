import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const FileTableBlock: Block = {
  slug: 'fileTable',
  labels: {
    singular: 'File Table',
    plural: 'File Tables',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'files',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
