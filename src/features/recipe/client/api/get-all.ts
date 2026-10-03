import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import type { ReducedRecipe } from '@/types/recipe'

let recipeList: Promise<ReducedRecipe[]> | undefined = undefined

/** Fetched once per document, when the search palette first opens. */
export const loadRecipeList = () => {
  if (!recipeList) {
    const request = readResponse(fetch('/api/recipes'))
    recipeList = request
    // Never pin a rejected promise: a single network blip would break every later opening.
    request.catch(() => {
      if (recipeList === request) {
        recipeList = undefined
      }
    })
  }
  return recipeList
}
