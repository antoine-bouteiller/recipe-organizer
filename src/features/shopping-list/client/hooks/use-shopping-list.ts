import { use } from 'react'

import { loadRecipesByIds } from '@/features/shopping-list/client/api/get-recipe-by-ids'
import { useRecipeQuantitiesState } from '@/stores/recipe-quantities.store'
import { useShoppingListIds } from '@/stores/shopping-list.store'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'

/** Suspends while the selected recipes load. */
export const useShoppingList = () => {
  const shoppingList = useShoppingListIds()
  const recipesQuantities = useRecipeQuantitiesState()
  const recipes = shoppingList.length > 0 ? use(loadRecipesByIds(shoppingList)) : []

  return aggregateShoppingList(recipes, recipesQuantities)
}
