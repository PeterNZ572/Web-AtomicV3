import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../../../blocks/shared'

export const ProjectCardsBlock: Block = {
  slug: 'projectCards',
  labels: {
    singular: 'Project Cards',
    plural: 'Project Cards',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'source',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Featured Projects', value: 'featured' },
        { label: 'Latest Projects', value: 'latest' },
        { label: 'Manual Projects', value: 'manual' },
      ],
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12 },
    {
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
