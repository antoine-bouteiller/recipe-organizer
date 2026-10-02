import { loadRecipesByIds } from '@client/features/shopping-list/api/get-recipe-by-ids'
import { useRecipeQuantitiesState } from '@client/stores/recipe-quantities.store'
import { useShoppingListIds } from '@client/stores/shopping-list.store'
import { use } from 'react'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'

/** Suspends while the selected recipes load. */
export const useShoppingList = () => {
  const shoppingList = useShoppingListIds()
  const recipesQuantities = useRecipeQuantitiesState()
  const recipes = shoppingList.length > 0 ? use(loadRecipesByIds(shoppingList)) : []

  return aggregateShoppingList(recipes, recipesQuantities)
}
