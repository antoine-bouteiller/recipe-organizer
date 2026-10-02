import { getApiUser } from '@recipe-organizer/server/lib/auth/api-user'
import { defineMiddleware } from 'void'

interface PageAuthUser {
  email?: string
  role: string | null | undefined
}

declare module 'void' {
  interface CloudContextVariables {
    // `pathname` lets island layouts, which have no router, mark the current navigation item.
    shared: { authUser: PageAuthUser | null; pathname: string }
  }
}

const isPagePath = (path: string) => path !== '/api' && !path.startsWith('/api/') && !/\.[^/]+$/u.test(path)

export default defineMiddleware(async (context, next) => {
  if (isPagePath(context.req.path)) {
    const user = await getApiUser(context)
    context.set('shared', { authUser: user ? { email: user.email, role: user.role } : null, pathname: context.req.path })
  }
  await next()
})
