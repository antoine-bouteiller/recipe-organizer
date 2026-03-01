import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'

const getUsersList = createServerFn({
  method: 'GET',
})
  .middleware([authGuard('admin')])
  .handler(() =>
    getDb().query.user.findMany({
      orderBy: {
        email: 'asc',
      },
    })
  )

const getUserListOptions = () =>
  queryOptions({
    queryFn: getUsersList,
    queryKey: queryKeys.listUsers(),
  })

export { getUserListOptions }
