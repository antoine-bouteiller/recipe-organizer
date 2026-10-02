import type { CloudContext } from 'void'

import { getApiUser } from './api-user'
import type { ApiUser } from './api-user'

/** Resolves the member allowed to see a page, or the redirect a page loader must return instead. */
export const guardPage = async (context: CloudContext, role?: 'admin'): Promise<ApiUser | Response> => {
  const user = await getApiUser(context)
  if (!user) {
    return context.redirect('/auth/login')
  }
  if (user.status === 'blocked' || user.status === 'pending') {
    return context.redirect(`/auth/login?error=account_${user.status}`)
  }
  if (role === 'admin' && user.role !== 'admin') {
    return context.redirect('/settings')
  }
  return user
}
