import type { CollectionConfig } from 'payload'

import { adminsOnly } from '../lib/access'

export const BackupHistory: CollectionConfig = {
  slug: 'backup-history',
  labels: { singular: 'Backup Record', plural: 'Backup History' },
  admin: {
    group: 'System',
    useAsTitle: 'startedAt',
    defaultColumns: ['backupType', 'status', 'startedAt', 'fileSizeBytes', 'durationMs'],
    description: 'Audit log of all database and full-site backups.',
  },
  access: {
    create: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      name: 'backupType',
      type: 'select',
      label: 'Type',
      required: true,
      options: [
        { label: 'Database', value: 'database' },
        { label: 'Full Site', value: 'full-site' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      options: [
        { label: 'Running', value: 'running' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'startedAt',
      type: 'date',
      label: 'Started At',
      required: true,
      admin: { date: { displayFormat: 'd MMM yyyy HH:mm:ss' } },
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Completed At',
      admin: { date: { displayFormat: 'd MMM yyyy HH:mm:ss' } },
    },
    {
      name: 'durationMs',
      type: 'number',
      label: 'Duration (ms)',
    },
    {
      name: 'fileSizeBytes',
      type: 'number',
      label: 'File Size (bytes)',
    },
    {
      name: 'r2ObjectKey',
      type: 'text',
      label: 'R2 Object Key',
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      label: 'Error Message',
    },
  ],
}
