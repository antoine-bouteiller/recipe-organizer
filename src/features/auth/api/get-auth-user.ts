import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { getAuth } from '@/features/auth/lib/auth-server'
import { getDb } from '@/lib/db'
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

    const authSession = await getAuth().api.getSession({ headers: getRequest().headers })

    if (!authSession?.user?.id) {
      return undefined
    }

    const authUser = await getDb().query.user.findFirst({
      where: { id: authSession.user.id },
    })

    return authUser
  })
)
