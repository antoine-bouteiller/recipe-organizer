import { defineHandler } from 'void'
import * as z from 'zod'

import { user } from '@/db/schema'
import { userSchema, userStatusSchema } from '@/features/users/schemas'
import { listUsers } from '@/features/users/server/queries'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'

export const GET = withAuthGuard(
  defineHandler.withValidator({ query: z.object({ status: userStatusSchema }) })((_context, { query }) => listUsers(getDb(), query.status)),
  'admin'
)

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: userSchema })(async (_context, { body }) => {
    await getDb()
      .insert(user)
      .values({ ...body, id: crypto.randomUUID(), name: body.email })
  }),
  'admin'
)
