import { defineMiddleware } from 'void'

import { getApiUser } from '@/lib/server/auth/api-user'

interface PageAuthUser {
  email?: string
  role: string | null | undefined
}

declare module 'void' {
  interface CloudContextVariables {
    shared: { authUser: PageAuthUser | null; pathname: string }
  }
}

const isPagePath = (path: string) => path !== '/api' && !path.startsWith('/api/') && !/\.[^/]+$/u.test(path)

export default defineMiddleware(async (context, next) => {
  if (isPagePath(context.req.path)) {
    const user = getApiUser()
    context.set('shared', { authUser: user ? { email: user.email, role: user.role } : null, pathname: context.req.path })
  }
  await next()
})
