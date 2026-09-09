import type { Block } from 'payload'

import { buttonStyleOptions, contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const ButtonsBlock: Block = {
  slug: 'buttons',
  labels: {
    singular: 'Buttons',
    plural: 'Buttons',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'buttons',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'style', type: 'select', defaultValue: 'primary', options: [...buttonStyleOptions] },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
