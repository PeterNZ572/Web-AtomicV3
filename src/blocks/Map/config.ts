import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const MapBlock: Block = {
  slug: 'map',
  labels: {
    singular: 'Map',
    plural: 'Maps',
  },
  fields: [
    contentBlockNameField,
    { name: 'address', type: 'textarea' },
    { name: 'latitude', type: 'text' },
    { name: 'longitude', type: 'text' },
    { name: 'zoom', type: 'number', defaultValue: 14, min: 1, max: 20 },
    { name: 'mapHeight', type: 'text', defaultValue: '420px' },
    ...contentBlockAdvancedFields(),
  ],
}
