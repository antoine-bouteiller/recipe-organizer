import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

import { getAuthUser } from '../api/get-auth-user'

export const authGuard = (role?: string) =>
  createMiddleware({ type: 'function' }).server(async ({ next }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/auth/login' })
    }

    if (user.status === 'blocked') {
      throw redirect({ to: '/auth/login', search: { error: 'account_blocked' } })
    }

    if (user.status === 'pending') {
      throw redirect({ to: '/auth/login', search: { error: 'account_pending' } })
    }

    if (role === 'admin' && user?.role !== 'admin') {
      throw new Error('Permission denied')
    }

    return next({ context: { user } })
  })
