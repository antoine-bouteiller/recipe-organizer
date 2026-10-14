import { queryOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import type { UserStatus } from '@/features/users/schemas'
import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const userListQuery = (status: UserStatus) =>
  queryOptions({ queryFn: () => readResponse(fetch('/api/users', { query: { status } })), queryKey: queryKeys.userList(status) })
