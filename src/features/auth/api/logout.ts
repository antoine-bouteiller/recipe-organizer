import { withServerErrorCapture } from '@/lib/error-handler'
import { useAppSession } from '@/lib/session'
import { createServerFn } from '@tanstack/react-start'

export const logout = createServerFn({ method: 'POST' }).handler(
  withServerErrorCapture(async () => {
    const session = await useAppSession()

    await session.clear()

    return { success: true }
  })
)
