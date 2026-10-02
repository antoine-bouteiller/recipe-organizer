import { getApiUser } from '@recipe-organizer/server/lib/auth/api-user'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  // Blocked or pending members are sent here by the page guard and must see their error.
  const user = await getApiUser(context)
  if (user?.status === 'active') {
    return context.redirect('/')
  }
  return { error: context.req.query('error') }
})
