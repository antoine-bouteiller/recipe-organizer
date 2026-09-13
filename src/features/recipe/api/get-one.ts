import { queryOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const getRecipe = async (id: number) => readResponse(apiClient.recipes[':id'].$get({ param: { id: String(id) } }))

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

export const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipe(id),
    queryKey: queryKeys.recipeDetail(id),
  })
