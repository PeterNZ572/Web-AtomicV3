import type { CollectionConfig } from 'payload'

import { editorsAndAdmins } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: editorsAndAdmins,
    delete: editorsAndAdmins,
    read: () => true,
    update: editorsAndAdmins,
  },
  upload: {
    staticDir: 'public/media',
    adminThumbnail: 'card',
    imageSizes: [
      {
        name: 'card',
        width: 720,
        height: 540,
        position: 'center',
      },
      {
        name: 'hero',
        width: 1600,
        height: 1100,
        position: 'center',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'center',
      },
    ],
    mimeTypes: [
      'image/*',
      'video/*',
      'application/pdf',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
}
