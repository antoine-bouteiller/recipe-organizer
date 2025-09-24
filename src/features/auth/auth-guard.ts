import { getAuthUser } from '@/features/auth/api/get-auth-user'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

export const authGuard = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = await getAuthUser()
  if (!session) {
    throw redirect({ to: '/auth/login' })
  }
  return next()
})
