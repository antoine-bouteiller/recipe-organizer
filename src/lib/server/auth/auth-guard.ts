import { HTTPException } from 'hono/http-exception'
import type { CloudContext } from 'void'

import { getApiUser } from './api-user'
import type { ApiUser } from './api-user'

declare module 'void' {
  // Void already owns `user` for its own auth integration.
  interface CloudContextVariables {
    apiUser: ApiUser
  }
}

const authorize = async (context: CloudContext, role?: string) => {
  const user = await getApiUser(context)

  if (!user) {
    throw new HTTPException(401, { message: 'unauthorized' })
  }
  if (user.status === 'blocked') {
    throw new HTTPException(403, { message: 'account_blocked' })
  }
  if (user.status === 'pending') {
    throw new HTTPException(403, { message: 'account_pending' })
  }
  if (role === 'admin' && user.role !== 'admin') {
    throw new HTTPException(403, { message: 'Permission denied' })
  }

  context.set('apiUser', user)
}

/** Authorizes the request before `handler` runs (and before its validators), keeping the handler's route types. */
export const withAuthGuard = <THandler extends (context: CloudContext) => unknown>(handler: THandler, role?: string) =>
  Object.assign(async (context: CloudContext) => {
    await authorize(context, role)
    return handler(context)
  }, handler)
