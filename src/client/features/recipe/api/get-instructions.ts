import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'

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
