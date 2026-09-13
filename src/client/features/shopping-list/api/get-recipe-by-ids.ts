import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'

const getRecipesByIds = async (ids: number[]) => readResponse(apiClient['shopping-list'].recipes.$get({ query: { ids: JSON.stringify(ids) } }))

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    enabled: ids.length > 0,
    queryFn: () => getRecipesByIds(ids),
    queryKey: queryKeys.recipeListByIds(ids),
  })

export { getRecipeByIdsOptions }
