import type { GlobalConfig } from 'payload'

import { adminsOnly } from '../lib/access'

export const BackupSettings: GlobalConfig = {
  slug: 'backup-settings',
  label: 'Backup Settings',
  admin: {
    group: 'System',
    description: 'Configure Cloudflare R2 credentials, backup schedules, and retention policy.',
  },
  access: {
    read: adminsOnly,
    update: adminsOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cloudflare R2',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Site Name',
              admin: {
                description:
                  'Used as the folder prefix in R2 (e.g. "my-website"). Lowercase with hyphens.',
                placeholder: 'my-website',
              },
            },
            {
              name: 'r2AccountId',
              type: 'text',
              label: 'Account ID',
              admin: {
                description: 'Your Cloudflare Account ID.',
                placeholder: 'a1b2c3d4e5f6...',
              },
            },
            {
              name: 'r2BucketName',
              type: 'text',
              label: 'Bucket Name',
              admin: { placeholder: 'my-backups' },
            },
            {
              name: 'r2Endpoint',
              type: 'text',
              label: 'Endpoint URL',
              admin: {
                description: 'S3-compatible endpoint for your R2 bucket.',
                placeholder: 'https://<accountId>.r2.cloudflarestorage.com',
              },
            },
            {
              name: 'r2AccessKey',
              type: 'text',
              label: 'Access Key ID',
              admin: { description: 'R2 API token Access Key ID.' },
            },
            {
              name: 'r2SecretKey',
              type: 'text',
              label: 'Secret Access Key',
              admin: { description: 'R2 API token Secret Access Key.' },
            },
            {
              name: 'r2Region',
              type: 'text',
              label: 'Region',
              defaultValue: 'auto',
              admin: { description: 'Leave as "auto" for Cloudflare R2.' },
            },
          ],
        },
        {
          label: 'Schedule',
          fields: [
            {
              name: 'dbBackupCron',
              type: 'text',
              label: 'Database Backup Cron',
              defaultValue: '0 1 * * *',
              admin: {
                description: 'Cron expression for nightly database backups. Default: 1:00 AM.',
                placeholder: '0 1 * * *',
              },
            },
            {
              name: 'fullBackupCron',
              type: 'text',
              label: 'Full Site Backup Cron',
              defaultValue: '0 2 * * *',
              admin: {
                description: 'Cron expression for nightly full-site backups. Default: 2:00 AM.',
                placeholder: '0 2 * * *',
              },
            },
          ],
        },
        {
          label: 'Retention',
          fields: [
            {
              name: 'dbRetentionCount',
              type: 'number',
              label: 'Database Backup Retention',
              defaultValue: 30,
              admin: {
                description:
                  'Maximum number of database backups to keep in R2. Older backups are deleted automatically.',
              },
            },
            {
              name: 'fullRetentionCount',
              type: 'number',
              label: 'Full Site Backup Retention',
              defaultValue: 30,
              admin: {
                description:
                  'Maximum number of full-site backups to keep in R2. Older backups are deleted automatically.',
              },
            },
          ],
        },
      ],
    },
  ],
}
