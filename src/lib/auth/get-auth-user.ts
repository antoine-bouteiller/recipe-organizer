import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { getAuth } from '@/lib/auth/auth-server'
import { withServerError } from '@/utils/error-handler'

let pending: ReturnType<typeof getAuthUser> | undefined = undefined

// Client-only by design: module scope on Workers is shared across requests, so caching a session there leaks it between users.
export const loadAuthUser = () => {
  if (import.meta.env.SSR || globalThis.window === undefined) {
    return getAuthUser()
  }

  if (!pending) {
    const request = getAuthUser()
    pending = request
    // Never pin a rejected promise: without this a single network blip breaks every later navigation.
    request.catch(() => {
      if (pending === request) {
        pending = undefined
      }
    })
  }

  return pending
}

export const resetAuthUserCache = () => {
  pending = undefined
}

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  withServerError(async () => {
    if (import.meta.env.DEV) {
      return {
        email: 'admin@test.fr',
        id: 'string',
        role: 'admin' as const,
        status: 'active' as const,
      }
    }

    const authSession = await getAuth().api.getSession({ headers: getRequestHeaders() })

    if (authSession === null) {
      return undefined
    }

    return { id: authSession.user.id, role: authSession.user.role, status: authSession.user.status }
  })
)
