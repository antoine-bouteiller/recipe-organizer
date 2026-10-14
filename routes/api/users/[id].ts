import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'
import * as z from 'zod'

import { user } from '@/db/schema'
import { userIdSchema } from '@/features/users/schemas'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'

export const PATCH = withAuthGuard(
  defineHandler.withValidator({ body: z.object({ status: z.enum(['active', 'blocked']) }), params: userIdSchema })(
    async (_context, { body, params }) => {
      await getDb().update(user).set({ status: body.status }).where(eq(user.id, params.id))
    }
  ),
  'admin'
)
