import { type ApiEnvironment } from '@server/api-context'
import { type Context } from 'hono'

export const getApiUser = async (context: Context<ApiEnvironment>): Promise<ApiEnvironment['Variables']['user'] | undefined> => {
  // Preserve the existing local-development identity; production always resolves a session.
  if (context.env.development) {
    return { email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }
  }

  const { headers, response: session } = await context.env.auth.api.getSession({ headers: context.req.raw.headers, returnHeaders: true })
  for (const cookie of headers.getSetCookie()) {
    context.header('set-cookie', cookie, { append: true })
  }
  if (session === null) {
    return undefined
  }

  return { id: session.user.id, role: session.user.role, status: session.user.status }
}
