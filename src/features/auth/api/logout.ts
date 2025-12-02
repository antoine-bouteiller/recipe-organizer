import { createServerFn } from '@tanstack/react-start'

import { useAppSession } from '@/lib/session'
import { withServerErrorCapture } from '@/utils/error-handler'

export const logout = createServerFn({ method: 'POST' }).handler(
  withServerErrorCapture(async () => {
    const session = await useAppSession()

    await session.clear()

    return { success: true }
  })
)
