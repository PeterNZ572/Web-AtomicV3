import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const AccordionBlock: Block = {
  slug: 'accordion',
  labels: {
    singular: 'Accordion',
    plural: 'Accordions',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText', required: true },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
