import { getContext, setContext } from 'svelte'

import type { Ingredient } from '@/types/ingredient'

const ingredientCatalogKey = Symbol('ingredient-catalog')

export const provideIngredientCatalog = (ingredients: () => readonly Ingredient[]) => {
  setContext(ingredientCatalogKey, {
    get current() {
      return ingredients()
    },
  })
}

export const useIngredientCatalog = (): { readonly current: readonly Ingredient[] } => getContext(ingredientCatalogKey) ?? { current: [] }
