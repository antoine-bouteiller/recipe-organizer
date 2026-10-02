import { userIdSchema } from '@recipe-organizer/shared/users/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

import { user } from '#server/db/schema'
import { withAuthGuard } from '#server/lib/auth/auth-guard'
import { getDb } from '#server/lib/db'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: userIdSchema })(async (_context, { body }) => {
    await getDb().update(user).set({ status: 'blocked' }).where(eq(user.id, body.id))
  }),
  'admin'
)
