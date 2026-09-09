import type { Block } from 'payload'

import { contentBlockAdvancedFields, contentBlockNameField } from '../shared'

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    contentBlockNameField,
    {
      name: 'videoType',
      type: 'select',
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Upload', value: 'upload' },
      ],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.videoType === 'youtube',
      },
    },
    {
      name: 'vimeoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.videoType === 'vimeo',
      },
    },
    {
      name: 'uploadVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.videoType === 'upload',
      },
    },
    { name: 'posterImage', type: 'upload', relationTo: 'media' },
    ...contentBlockAdvancedFields(),
  ],
}
