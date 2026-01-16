import { createServerFn } from '@tanstack/react-start'

import { useAppSession } from '@/lib/session'
import { withServerError } from '@/utils/error-handler'

export const logout = createServerFn({ method: 'POST' }).handler(
  withServerError(async () => {
    const session = await useAppSession()

    await session.clear()

    return { success: true }
  })
)
