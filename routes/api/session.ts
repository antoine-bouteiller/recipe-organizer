import { defineHandler } from 'void'

import { getApiUser } from '@/lib/server/auth/api-user'

export const GET = defineHandler(() => {
  const user = getApiUser()
  return user ? { email: user.email ?? null, role: user.role ?? null, status: user.status ?? null } : null
})
