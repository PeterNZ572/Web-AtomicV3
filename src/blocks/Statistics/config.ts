import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const StatisticsBlock: Block = {
  slug: 'statistics',
  labels: {
    singular: 'Statistics',
    plural: 'Statistics',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'number', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
