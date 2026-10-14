import { queryOptions } from '@tanstack/svelte-query'
import { FetchError, fetch } from 'void/client'

import type { getRecipeDetails } from '@/features/recipe/server/queries'
import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export type Recipe = NonNullable<Awaited<ReturnType<typeof getRecipeDetails>>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

const getRecipeDetail = async (id: number) => {
  // Unknown recipes resolve to `null` so the screen shows NotFound instead of the error page.
  if (!Number.isInteger(id)) {
    return null
  }
  try {
    return await readResponse(fetch('/api/recipes/:id', { params: { id: String(id) } }))
  } catch (error) {
    if (error instanceof Error && error.cause instanceof FetchError && error.cause.status === 404) {
      return null
    }
    throw error
  }
}

export const recipeDetailQuery = (id: number) => queryOptions({ queryFn: () => getRecipeDetail(id), queryKey: queryKeys.recipeDetail(id) })
