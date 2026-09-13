import { type ApiEnvironment } from '@server/api-context'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { getApiUser } from './api-user'

export const authGuard = (role?: string) =>
  createMiddleware<ApiEnvironment>(async (context, next) => {
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

    context.set('user', user)
    await next()
  })
