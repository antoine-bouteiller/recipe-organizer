import type { listUsers } from '@/features/users/server/queries'

export type User = Awaited<ReturnType<typeof listUsers>>[number]
