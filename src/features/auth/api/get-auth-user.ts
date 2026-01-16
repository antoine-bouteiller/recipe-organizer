import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { useAppSession } from '@/lib/session'
import { withServerError } from '@/utils/error-handler'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  withServerError(async () => {
    const session = await useAppSession()

    if (!session?.data?.userId) {
      return undefined
    }

    const authUser = await getDb().query.user.findFirst({
      where: eq(user.id, session.data?.userId),
    })

    if (!authUser) {
      return undefined
    }

    return authUser
  })
)
