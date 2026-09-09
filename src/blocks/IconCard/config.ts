import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const IconCardBlock: Block = {
  slug: 'iconCard',
  labels: {
    singular: 'Icon Card',
    plural: 'Icon Cards',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
      admin: {
        description: 'Lucide icon name, e.g. Search, Cloud, Code, Headphones',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left' },
      ],
    },
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'text', type: 'textarea', label: 'Text' },
    { name: 'linkLabel', type: 'text', label: 'Link Label' },
    { name: 'linkUrl', type: 'text', label: 'Link URL' },
    { name: 'newTab', type: 'checkbox', defaultValue: false, label: 'Open in new tab' },
    ...contentBlockAdvancedFields(),
  ],
}
