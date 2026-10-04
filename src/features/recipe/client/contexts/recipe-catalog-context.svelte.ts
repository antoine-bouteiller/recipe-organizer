import { getContext, setContext } from 'svelte'

import type { ReducedRecipe } from '@/types/recipe'

const key = Symbol('recipe-catalog')

export const provideRecipeCatalog = (recipes: () => readonly ReducedRecipe[]) =>
  setContext(key, {
    get current() {
      return recipes()
    },
  })
export const useRecipeCatalog = () => getContext<{ readonly current: readonly ReducedRecipe[] } | undefined>(key) ?? { current: [] }
