import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'

import { getSubrecipeRecipeIds } from '../utils/get-subrecipe-recipe-ids'
import { getRecipeInstructionsOptions } from './get-instructions'

const getRecipe = async (id: number) => readResponse(apiClient.recipes[':id'].$get({ param: { id: String(id) } }))

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

export const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    networkMode: 'offlineFirst',
    queryFn: async ({ client }) => {
      const recipe = await getRecipe(id)

      for (const recipeId of getSubrecipeRecipeIds(recipe?.instructions)) {
        void client.query(getRecipeInstructionsOptions(recipeId)).catch(() => undefined)
      }

      return recipe
    },
    queryKey: queryKeys.recipeDetail(id),
  })
