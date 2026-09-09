import type { CollectionConfig } from 'payload'

import { editorsAndAdmins } from '../../lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: editorsAndAdmins,
    delete: editorsAndAdmins,
    read: () => true,
    update: editorsAndAdmins,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'featured'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
