import { headers } from 'next/headers'

import { BackupService } from '@/lib/backup/BackupService'
import type { BackupSettingsData } from '@/lib/backup/types'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as { role?: string }).role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const type = url.searchParams.get('type')

  if (type !== 'database' && type !== 'full') {
    return Response.json(
      { error: 'Invalid type. Use ?type=database or ?type=full' },
      { status: 400 },
    )
  }

  const settings = (await payload.findGlobal({
    slug: 'backup-settings',
    overrideAccess: true,
  })) as BackupSettingsData

  const service = new BackupService(payload, settings)

  const result =
    type === 'database' ? await service.runDatabaseBackup() : await service.runFullBackup()

  return Response.json(result, { status: result.success ? 200 : 500 })
}
