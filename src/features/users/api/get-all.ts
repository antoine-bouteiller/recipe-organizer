import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'

const getUsersListSchema = v.object({
  status: v.optional(v.picklist(['pending', 'active', 'blocked']), 'active'),
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
