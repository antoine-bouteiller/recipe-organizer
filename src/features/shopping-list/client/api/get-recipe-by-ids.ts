import { queryOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const recipeListByIdsQuery = (ids: readonly number[]) =>
  queryOptions({
    queryFn: () => readResponse(fetch('/api/shopping-list/recipes', { query: { ids: JSON.stringify(ids) } })),
    queryKey: queryKeys.recipeListByIds(ids),
  })
