import { user } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { userIdSchema } from '@recipe-organizer/shared/users/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: userIdSchema })(async (_context, { body }) => {
    await getDb().update(user).set({ status: 'active' }).where(eq(user.id, body.id))
  }),
  'admin'
)
