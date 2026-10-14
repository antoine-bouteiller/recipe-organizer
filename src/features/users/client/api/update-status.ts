import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const updateUserStatusMutation = (id: string) =>
  mutationOptions({
    mutationFn: (status: 'active' | 'blocked') => readResponse(fetch('/api/users/:id', { body: { status }, method: 'PATCH', params: { id } })),
    onSuccess: (_data, _variables, _result, { client }) => client.invalidateQueries({ queryKey: queryKeys.allUsers }),
  })
