import type { Access } from 'payload'

import type { User } from '@/payload-types'

export const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

export const isAdmin = (user: User | null): boolean => {
  return user?.roles?.includes('admin') ?? false
}
