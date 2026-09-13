import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'

const getRecipe = async (id: number) => readResponse(apiClient.recipes[':id'].$get({ param: { id: String(id) } }))

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

export const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipe(id),
    queryKey: queryKeys.recipeDetail(id),
  })
