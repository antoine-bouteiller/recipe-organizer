import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const getRecipe = async (id: number) => readResponse(fetch('/api/recipes/:id', { params: { id: String(id) } }))

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

export const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipe(id),
    queryKey: queryKeys.recipeDetail(id),
  })
