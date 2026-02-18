import { createServerFn } from '@tanstack/react-start'

import { useAppSession } from '@/lib/session'

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()

  await session.clear()

  return { success: true }
})
