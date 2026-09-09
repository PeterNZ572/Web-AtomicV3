import type { CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

const canCreateUser = async ({ req }: { req: any }) => {
  const existing = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })

  if (existing.totalDocs === 0) {
    return true
  }

  return isAdmin(req.user)
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  access: {
    create: canCreateUser,
    delete: ({ req: { user } }) => isAdmin(user),
    read: ({ req: { user } }) => {
      if (!user) {
        return false
      }

      if (isAdmin(user)) {
        return true
      }

      return {
        id: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (!user) {
        return false
      }

      if (isAdmin(user)) {
        return true
      }

      return {
        id: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
    },
  ],
}
