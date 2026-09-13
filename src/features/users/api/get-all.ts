import { queryOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

import { type UserStatus } from './schemas'

const getUserListOptions = (status: UserStatus = 'active') =>
  queryOptions({
    queryFn: async () => {
      const users = await readResponse(apiClient.users.$get({ query: { status } }))
      return users.map((user) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }))
    },
    queryKey: queryKeys.listUsers(status),
  })

export { getUserListOptions }
