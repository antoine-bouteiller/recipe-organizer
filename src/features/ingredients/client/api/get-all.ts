import { queryOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const ingredientListQuery = () =>
  queryOptions({ queryFn: () => readResponse(fetch('/api/ingredients')), queryKey: queryKeys.ingredientList() })
