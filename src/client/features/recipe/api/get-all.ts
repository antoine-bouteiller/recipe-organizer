import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'

const getAllRecipes = async () => readResponse(apiClient.recipes.$get())

export const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })
