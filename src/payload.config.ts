import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { smtp2goAdapter } from './lib/email'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { createAtomicCMSPlugin } from './plugin'

// Site-specific additions — customize/replace these when copying this repo for a new site
import { Projects } from './_site-specific/collections/Projects'
import { Testimonials } from './_site-specific/collections/Testimonials'
import { ProjectCardsBlock } from './_site-specific/blocks/ProjectCards/config'
import { TestimonialsBlock } from './_site-specific/blocks/Testimonials/config'
import { BookingSearchFormBlock } from './_site-specific/blocks/BookingSearchForm/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Enabled = Boolean(process.env.S3_ACCESS_KEY_ID && process.env.S3_BUCKET)
const isPostgres = /^postgres(ql)?:\/\//.test(process.env.DATABASE_URI || '')

export default buildConfig({
  email: smtp2goAdapter,
  secret: process.env.PAYLOAD_SECRET || 'atomic-cms-local-secret-change-me',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
  }),
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
        migrationDir: path.resolve(dirname, 'migrations-postgres'),
        idType: 'uuid',
        // Payload auto-pushes schema changes whenever NODE_ENV !== 'production',
        // which would silently ALTER (and drop) tables on whatever database
        // DATABASE_URI points at. Opt in explicitly instead.
        push: process.env.PAYLOAD_DB_PUSH === 'true',
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || 'file:./atomic-cms.db',
        },
        migrationDir: path.resolve(dirname, 'migrations'),
        idType: 'uuid',
      }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  admin: {
    user: 'users',
    theme: 'dark',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  sharp,
  onInit: async (payload) => {
    payload.logger.info(`Atomic CMS initialized (storage: ${s3Enabled ? 's3' : 'local'})`)
  },
  plugins: [
    createAtomicCMSPlugin({
      additionalCollections: [Projects, Testimonials],
      additionalBlocks: [ProjectCardsBlock, TestimonialsBlock, BookingSearchFormBlock],
      admin: {
        icon: './app/(payload)/components/admin/AtomicAdminIcon.tsx#AtomicAdminIcon',
        logo: './app/(payload)/components/admin/AtomicAdminLogo.tsx#AtomicAdminLogo',
        beforeDashboard: ['./_site-specific/components/admin/DashboardHero.tsx#DashboardHero'],
        afterNavLinks: ['./app/(payload)/components/admin/BackupNavLink.tsx#BackupNavLink'],
        views: {
          backupManager: {
            Component: './app/(payload)/components/admin/BackupManagerView.tsx#BackupManagerView',
            path: '/backup',
          },
        },
      },
    }),
    ...(s3Enabled
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
                generateFileURL: ({ filename, prefix }) =>
                  `${process.env.S3_PUBLIC_URL}/${prefix}/${filename}`,
              },
            },
            bucket: process.env.S3_BUCKET || '',
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT || '',
            },
          }),
        ]
      : []),
  ],
})
