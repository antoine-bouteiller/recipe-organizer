import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getAuthUser } from './api/get-auth-user'

export const authGuard = (role?: string) =>
  createMiddleware({ type: 'function' }).server(async ({ next }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/auth/login' })
    }

    if (role === 'admin' && user?.role !== 'admin') {
      throw new Error('Permission denied')
    }

    return next()
  })
