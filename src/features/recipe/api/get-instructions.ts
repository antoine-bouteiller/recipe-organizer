import { queryOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const getRecipeInstructions = async (id: number) => {
  const result = await readResponse(apiClient.recipes[':id'].instructions.$get({ param: { id: String(id) } }))
  return result ?? undefined
}

const getRecipeInstructionsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipeInstructions(id),
    queryKey: queryKeys.recipeInstructions(id),
    staleTime: 5 * 60 * 1000,
  })

export { getRecipeInstructionsOptions }
