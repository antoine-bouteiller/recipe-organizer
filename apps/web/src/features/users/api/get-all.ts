import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import type { UserStatus } from '@recipe-organizer/shared/users/schemas'
import { queryOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const getUserListOptions = (status: UserStatus = 'active') =>
  queryOptions({
    queryFn: async () => {
      const users = await readResponse(fetch('/api/users', { query: { status } }))
      return users.map((user) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }))
    },
    queryKey: queryKeys.listUsers(status),
  })

export { getUserListOptions }
