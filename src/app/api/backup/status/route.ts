import { headers } from 'next/headers'

import type { BackupSettingsData } from '@/lib/backup/types'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'

export async function GET() {
  const payload = await getPayloadClient()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as { role?: string }).role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const settings = (await payload.findGlobal({
    slug: 'backup-settings',
    overrideAccess: true,
  })) as BackupSettingsData

  const [lastDbResult, lastFullResult] = await Promise.all([
    payload.find({
      collection: 'backup-history',
      where: { backupType: { equals: 'database' } },
      sort: '-startedAt',
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'backup-history',
      where: { backupType: { equals: 'full-site' } },
      sort: '-startedAt',
      limit: 1,
      overrideAccess: true,
    }),
  ])

  const r2Configured = Boolean(
    settings.r2Endpoint && settings.r2AccessKey && settings.r2SecretKey && settings.r2BucketName,
  )

  return Response.json({
    lastDbBackup: lastDbResult.docs[0] ?? null,
    lastFullBackup: lastFullResult.docs[0] ?? null,
    r2Configured,
    bucketName: settings.r2BucketName ?? null,
    siteName: settings.siteName ?? null,
    dbRetentionCount: settings.dbRetentionCount ?? 30,
    fullRetentionCount: settings.fullRetentionCount ?? 30,
    dbBackupCron: settings.dbBackupCron ?? '0 1 * * *',
    fullBackupCron: settings.fullBackupCron ?? '0 2 * * *',
  })
}
