import type { UserStatus } from '@recipe-organizer/shared/users/schemas'

import type { getDb } from '#server/lib/db'

export const listUsers = (db: ReturnType<typeof getDb>, status: UserStatus) =>
  db.query.user.findMany({ orderBy: { email: 'asc' }, where: { status } })
