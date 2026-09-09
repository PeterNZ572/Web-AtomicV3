import type { Access, FieldAccess } from 'payload'

type UserLike = {
  role?: 'admin' | 'editor'
  id?: string | number
}

const getUser = (user: unknown) => (user && typeof user === 'object' ? (user as UserLike) : null)

export const isAdmin = (user: unknown) => getUser(user)?.role === 'admin'

export const isAdminOrEditor = (user: unknown) => {
  const role = getUser(user)?.role
  return role === 'admin' || role === 'editor'
}

export const adminsOnly: Access = ({ req: { user } }) => isAdmin(user)

export const editorsAndAdmins: Access = ({ req: { user } }) => isAdminOrEditor(user)

export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const adminFieldAccess: FieldAccess = ({ req: { user } }) => isAdmin(user)
