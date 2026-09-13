import { queryOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const getRecipesByIds = async (ids: number[]) => readResponse(apiClient['shopping-list'].recipes.$get({ query: { ids: JSON.stringify(ids) } }))

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    enabled: ids.length > 0,
    queryFn: () => getRecipesByIds(ids),
    queryKey: queryKeys.recipeListByIds(ids),
  })

export { getRecipeByIdsOptions }
