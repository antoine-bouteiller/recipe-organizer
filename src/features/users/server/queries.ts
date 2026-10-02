import type { UserStatus } from '@/features/users/schemas'
import type { getDb } from '@/lib/server/db'

export const listUsers = (db: ReturnType<typeof getDb>, status: UserStatus) =>
  db.query.user.findMany({ orderBy: { email: 'asc' }, where: { status } })
