import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db } from 'void/db'

import { authGuard } from '@/features/auth/lib/auth-guard'
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
    db.query.user.findMany({
      orderBy: (fields, { asc }) => asc(fields.email),
      where: (fields, { eq }) => eq(fields.status, data.status),
    })
  )

const getUserListOptions = (status: 'pending' | 'active' | 'blocked' = 'active') =>
  queryOptions({
    queryFn: () => getUsersList({ data: { status } }),
    queryKey: queryKeys.listUsers(status),
  })

export { getUserListOptions }
