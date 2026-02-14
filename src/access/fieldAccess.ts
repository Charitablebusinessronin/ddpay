import type { FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const adminOnlyFieldAccess: FieldAccess<User> = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

export const isAdmin = (user: User | null | undefined): boolean => {
  return user?.roles?.includes('admin') ?? false
}

export const isMerchant = (user: User | null | undefined): boolean => {
  return user?.roles?.includes('merchant') ?? false
}
