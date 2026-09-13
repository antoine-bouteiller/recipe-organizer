import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'

const getIngredientListOptions = () =>
  queryOptions({
    queryFn: () => readResponse(apiClient.ingredients.$get()),
    queryKey: queryKeys.listIngredients(),
  })

export { getIngredientListOptions }
