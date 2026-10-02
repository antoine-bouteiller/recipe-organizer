import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const getRecipeInstructions = async (id: number) => {
  const result = await readResponse(fetch('/api/recipes/:id/instructions', { params: { id: String(id) } }))
  return result ?? undefined
}

const getRecipeInstructionsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipeInstructions(id),
    queryKey: queryKeys.recipeInstructions(id),
    staleTime: 5 * 60 * 1000,
  })

export { getRecipeInstructionsOptions }
