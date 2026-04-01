import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/lib/db'
import { useAppSession } from '@/lib/session'
import { withServerError } from '@/utils/error-handler'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  withServerError(async () => {
    const session = await useAppSession()

    if (import.meta.env.DEV) {
      return {
        email: 'admin@test.fr',
        id: 'string',
        role: 'admin',
        status: 'active' as const,
      }
    }

    if (!session?.data?.userId) {
      return undefined
    }

    const authUser = await getDb().query.user.findFirst({
      where: { id: session.data?.userId },
    })

    if (!authUser) {
      return undefined
    }

    return authUser
  })
)
