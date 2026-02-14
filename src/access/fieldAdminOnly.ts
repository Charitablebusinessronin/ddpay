import type { FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const fieldAdminOnly: FieldAccess<User> = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}
