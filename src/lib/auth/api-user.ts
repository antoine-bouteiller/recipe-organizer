import { type Context } from 'hono'

import { type ApiEnvironment } from '@/lib/api-context'

export const getApiUser = async (context: Context<ApiEnvironment>): Promise<ApiEnvironment['Variables']['user'] | undefined> => {
  // Preserve the existing local-development identity; production always resolves a session.
  if (context.env.development) {
    return { email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }
  }

  const session = await context.env.auth.api.getSession({ headers: context.req.raw.headers })
  if (session === null) {
    return undefined
  }

  return { id: session.user.id, role: session.user.role, status: session.user.status }
}
