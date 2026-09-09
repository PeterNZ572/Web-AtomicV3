import type { Field } from 'payload'

import { hideOptions } from '../lib/builder-config'

export const contentBlockNameField: Field = {
  name: 'blockName',
  label: 'Content Block Name',
  type: 'text',
  admin: {
    description: 'Internal label used in the admin builder.',
  },
}

export const contentBlockAdvancedFields = (): Field[] => [
  {
    type: 'collapsible',
    label: 'Advanced',
    admin: {
      className: 'atomic-builder__advanced',
      initCollapsed: true,
      description: 'Technical styling and visibility controls.',
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'customCssClass',
            label: 'Custom CSS Class',
            type: 'text',
          },
          {
            name: 'customCssId',
            label: 'Custom CSS ID',
            type: 'text',
          },
        ],
      },
      {
        name: 'customInlineStyle',
        label: 'Custom Inline Style',
        type: 'textarea',
        admin: {
          description: 'Rendered inline on the block wrapper. Example: border-radius: 25px;',
        },
      },
      {
        name: 'hide',
        type: 'select',
        defaultValue: 'no',
        options: [...hideOptions],
      },
    ],
  },
]

export const contentBlockBaseFields = (): Field[] => [
  contentBlockNameField,
  ...contentBlockAdvancedFields(),
]

export const buttonStyleOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Text Link', value: 'text' },
] as const
