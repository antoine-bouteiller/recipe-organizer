import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const getRecipesByIds = async (ids: number[]) => readResponse(fetch('/api/shopping-list/recipes', { query: { ids: JSON.stringify(ids) } }))

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    enabled: ids.length > 0,
    queryFn: () => getRecipesByIds(ids),
    queryKey: queryKeys.recipeListByIds(ids),
  })

export { getRecipeByIdsOptions }
