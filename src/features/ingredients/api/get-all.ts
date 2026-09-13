import { queryOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const getIngredientListOptions = () =>
  queryOptions({
    queryFn: () => readResponse(apiClient.ingredients.$get()),
    queryKey: queryKeys.listIngredients(),
  })

export { getIngredientListOptions }
