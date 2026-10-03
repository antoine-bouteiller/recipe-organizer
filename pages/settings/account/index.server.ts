import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { guardPage } from '@/lib/server/auth/page-guard'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  const user = await guardPage(context)
  if (user instanceof Response) {
    return user
  }
  return { email: user.email }
})
