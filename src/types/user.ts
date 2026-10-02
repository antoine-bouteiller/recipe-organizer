import type { listUsers } from '@recipe-organizer/server/users/queries'

export type User = Awaited<ReturnType<typeof listUsers>>[number]
