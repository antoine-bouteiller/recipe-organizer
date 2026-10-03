import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { user } from '@/db/schema'
import { userIdSchema, userSchema } from '@/features/users/schemas'
import { listUsers } from '@/features/users/server/queries'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { guardPage } from '@/lib/server/auth/page-guard'
import { getDb } from '@/lib/server/db'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  const authUser = await guardPage(context, 'admin')
  if (authUser instanceof Response) {
    return authUser
  }
  const db = getDb()
  const [active, pending, blocked] = await Promise.all([listUsers(db, 'active'), listUsers(db, 'pending'), listUsers(db, 'blocked')])
  return { users: { active, blocked, pending } }
})

export const actions = {
  approve: withAuthGuard(
    defineHandler.withValidator({ body: userIdSchema })(async (_context, { body }) => {
      await getDb().update(user).set({ status: 'active' }).where(eq(user.id, body.id))
    }),
    'admin'
  ),
  block: withAuthGuard(
    defineHandler.withValidator({ body: userIdSchema })(async (_context, { body }) => {
      await getDb().update(user).set({ status: 'blocked' }).where(eq(user.id, body.id))
    }),
    'admin'
  ),
  create: withAuthGuard(
    defineHandler.withValidator({ body: userSchema })(async (_context, { body }) => {
      await getDb()
        .insert(user)
        .values({ ...body, id: crypto.randomUUID(), name: body.email })
    }),
    'admin'
  ),
}
