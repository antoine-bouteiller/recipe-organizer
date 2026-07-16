import { createServerFn } from '@tanstack/solid-start'
import { getRequestHeaders } from '@tanstack/solid-start/server'

import { getAuth } from '@/lib/auth/auth-server'
import { withServerError } from '@/utils/error-handler'

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
