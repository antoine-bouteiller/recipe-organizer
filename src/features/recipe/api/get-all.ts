import { queryOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const getAllRecipes = async () => readResponse(apiClient.recipes.$get())

export const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })
