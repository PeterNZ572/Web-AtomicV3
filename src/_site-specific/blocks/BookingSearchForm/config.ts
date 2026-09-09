import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../../../blocks/shared'

export const BookingSearchFormBlock: Block = {
  slug: 'bookingSearchForm',
  labels: {
    singular: 'Booking Search Form',
    plural: 'Booking Search Forms',
  },
  fields: [
    contentBlockNameField,
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    { name: 'buttonText', type: 'text', defaultValue: 'Search' },
    { name: 'destinationUrl', type: 'text' },
    ...contentBlockAdvancedFields(),
  ],
}
