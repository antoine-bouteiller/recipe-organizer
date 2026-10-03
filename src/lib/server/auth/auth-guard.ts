import type { CloudContext } from 'void'

import { HttpError } from '@/lib/server/http-error'

import { getApiUser } from './api-user'
import type { ApiUser } from './api-user'

declare module 'void' {
  // Void already owns `user` for its own auth integration.
  interface CloudContextVariables {
    apiUser: ApiUser
  }
}

const authorize = (context: CloudContext, role?: string) => {
  const user = getApiUser()

  if (!user) {
    throw new HttpError(401, 'unauthorized')
  }
  if (user.status === 'blocked') {
    throw new HttpError(403, 'account_blocked')
  }
  if (user.status === 'pending') {
    throw new HttpError(403, 'account_pending')
  }
  if (role === 'admin' && user.role !== 'admin') {
    throw new HttpError(403, 'Permission denied')
  }

  context.set('apiUser', user)
}

/** Authorizes the request before `handler` runs (and before its validators), keeping the handler's route types. */
export const withAuthGuard = <THandler extends (context: CloudContext) => unknown>(handler: THandler, role?: string) =>
  Object.assign(async (context: CloudContext) => {
    authorize(context, role)
    return handler(context)
  }, handler)
