import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const payload = await getPayloadClient()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as { role?: string }).role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const filterType = url.searchParams.get('type')
  const filterStatus = url.searchParams.get('status')

  const where: Record<string, { equals: string }> = {}
  if (filterType) where.backupType = { equals: filterType }
  if (filterStatus) where.status = { equals: filterStatus }

  const docs = await payload.find({
    collection: 'backup-history',
    sort: '-startedAt',
    limit: 50,
    where: Object.keys(where).length > 0 ? where : undefined,
    overrideAccess: true,
  })

  return Response.json(docs)
}
