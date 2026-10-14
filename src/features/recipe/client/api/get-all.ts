import { queryOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const recipeListQuery = () => queryOptions({ queryFn: () => readResponse(fetch('/api/recipes')), queryKey: queryKeys.recipeList() })
