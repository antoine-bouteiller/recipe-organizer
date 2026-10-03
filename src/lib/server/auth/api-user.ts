import { getUser } from 'void/auth'

export interface ApiUser {
  id: string
  role: string | null | undefined
  status: string | null | undefined
  email?: string
}

export const getApiUser = (): ApiUser | undefined => {
  // Preserve the existing local-development identity; production always resolves a session.
  if (import.meta.env.DEV) {
    return { email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }
  }

  const user = getUser()
  if (!user) {
    return undefined
  }
  // `role` and `status` are additional fields declared in the root `auth.ts`.
  const role = 'role' in user && typeof user.role === 'string' ? user.role : undefined
  const status = 'status' in user && typeof user.status === 'string' ? user.status : undefined
  return { email: user.email, id: user.id, role, status }
}
