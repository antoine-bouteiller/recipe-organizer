import type { CloudContext } from 'void'

import { getAuth } from '#server/lib/auth/auth-server'

export interface ApiUser {
  id: string
  role: string | null | undefined
  status: string | null | undefined
  email?: string
}

export const getApiUser = async (context: CloudContext): Promise<ApiUser | undefined> => {
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

  return { id: session.user.id, role: session.user.role, status: session.user.status }
}
