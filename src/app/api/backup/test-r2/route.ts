import { headers } from 'next/headers'

import { BackupService } from '@/lib/backup/BackupService'
import type { BackupSettingsData } from '@/lib/backup/types'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'

export async function POST() {
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

  const service = new BackupService(payload, settings)
  const result = await service.testR2Connection()

  return Response.json(result)
}
