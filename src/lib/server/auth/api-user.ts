import type { CloudContext } from 'void'

import { getAuth } from '@/lib/server/auth/auth-server'

export interface ApiUser {
  id: string
  role: string | null | undefined
  status: string | null | undefined
  email?: string
}

const resolveApiUser = async (context: CloudContext): Promise<ApiUser | undefined> => {
  // Preserve the existing local-development identity; production always resolves a session.
  if (import.meta.env.DEV) {
    return { email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }
  }

  const { headers, response: session } = await getAuth().api.getSession({ headers: context.req.raw.headers, returnHeaders: true })
  // `context.header` only reaches responses built through the context; handlers here return raw responses, which Hono merges with `context.res`.
  for (const cookie of headers.getSetCookie()) {
    context.res.headers.append('set-cookie', cookie)
  }
  if (session === null) {
    return undefined
  }

  return { email: session.user.email, id: session.user.id, role: session.user.role, status: session.user.status }
}

// Page middleware and the page loader both need the user; resolve the session once per request.
const requestUsers = new WeakMap<Request, Promise<ApiUser | undefined>>()

export const getApiUser = (context: CloudContext): Promise<ApiUser | undefined> => {
  let user = requestUsers.get(context.req.raw)
  if (!user) {
    user = resolveApiUser(context)
    requestUsers.set(context.req.raw, user)
  }
  return user
}
