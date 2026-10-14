import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import type { UserFormInput } from '@/features/users/schemas'
import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const createUserMutation = () =>
  mutationOptions({
    mutationFn: (body: Required<UserFormInput>) => readResponse(fetch('/api/users', { body, method: 'POST' })),
    onSuccess: (_data, _variables, _result, { client }) => client.invalidateQueries({ queryKey: queryKeys.allUsers }),
  })
