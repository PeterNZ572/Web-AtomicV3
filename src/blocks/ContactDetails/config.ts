import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const ContactDetailsBlock: Block = {
  slug: 'contactDetails',
  labels: {
    singular: 'Contact Details',
    plural: 'Contact Details',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: {
            description: 'Lucide icon name, e.g. Mail, Phone, MapPin, Clock3',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'lines',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'linkUrl',
              type: 'text',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'insetPanelHeading',
      type: 'text',
    },
    {
      name: 'insetPanelItems',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    ...contentBlockAdvancedFields(),
  ],
}
