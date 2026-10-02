import { user } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { guardPage } from '@recipe-organizer/server/lib/auth/page-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { listUsers } from '@recipe-organizer/server/users/queries'
import { userIdSchema, userSchema } from '@recipe-organizer/shared/users/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

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
