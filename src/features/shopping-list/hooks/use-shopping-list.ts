import { useQuery } from '@tanstack/solid-query'

import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import { useRecipeQuantitiesState } from '@/stores/recipe-quantities.store'
import { useShoppingListIds } from '@/stores/shopping-list.store'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'

export const useShoppingList = () => {
  const shoppingListIds = useShoppingListIds()
  const recipesQuantities = useRecipeQuantitiesState()

  const query = useQuery(() => getRecipeByIdsOptions(shoppingListIds()))

  return {
    isLoading: () => query.isLoading,
    recipesQuantities,
    shoppingListIngredients: () => aggregateShoppingList(query.data ?? [], recipesQuantities()),
  }
}
