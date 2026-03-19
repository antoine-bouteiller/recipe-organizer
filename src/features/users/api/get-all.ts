import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'

const getUsersListSchema = z.object({
  status: z.enum(['pending', 'active', 'blocked']).default('active'),
})

const getUsersList = createServerFn({
  method: 'GET',
})
  .middleware([authGuard('admin')])
  .inputValidator(getUsersListSchema)
  .handler(({ data }) =>
    getDb().query.user.findMany({
      orderBy: {
        email: 'asc',
      },
      where: { status: data.status },
    })
  )

const getUserListOptions = (status: 'pending' | 'active' | 'blocked' = 'active') =>
  queryOptions({
    queryFn: () => getUsersList({ data: { status } }),
    queryKey: queryKeys.listUsers(status),
  })

export { getUserListOptions }
