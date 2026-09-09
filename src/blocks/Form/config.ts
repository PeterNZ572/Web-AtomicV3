import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

const formFieldOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Select', value: 'select' },
  { label: 'Checkbox', value: 'checkbox' },
] as const

export const FormBlock: Block = {
  slug: 'form',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  fields: [
    contentBlockNameField,
    { name: 'formTitle', type: 'text' },
    { name: 'formDescription', type: 'textarea' },
    { name: 'recipientEmail', type: 'email' },
    {
      name: 'showFieldLabels',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'fields',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'placeholder', type: 'text' },
        { name: 'required', type: 'checkbox', defaultValue: false },
        { name: 'type', type: 'select', required: true, defaultValue: 'text', options: [...formFieldOptions] },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'full',
          options: [
            { label: 'Full Width', value: 'full' },
            { label: 'Half Width', value: 'half' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.type !== 'checkbox',
          },
        },
        {
          name: 'options',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }, { name: 'value', type: 'text', required: true }],
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'select' || siblingData?.type === 'checkbox',
          },
        },
      ],
    },
    { name: 'submitButtonText', type: 'text', defaultValue: 'Send enquiry' },
    { name: 'privacyNote', type: 'text' },
    { name: 'successMessage', type: 'textarea', defaultValue: 'Thanks for getting in touch.' },
    ...contentBlockAdvancedFields(),
  ],
}
