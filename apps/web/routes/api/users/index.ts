import { getUsersListSchema, userSchema } from '@recipe-organizer/shared/users/schemas'
import { defineHandler } from 'void'

import { user } from '#server/db/schema'
import { withAuthGuard } from '#server/lib/auth/auth-guard'
import { getDb } from '#server/lib/db'

export const GET = withAuthGuard(
  defineHandler.withValidator({ query: getUsersListSchema })((_context, { query }) =>
    getDb().query.user.findMany({ orderBy: { email: 'asc' }, where: { status: query.status } })
  ),
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
