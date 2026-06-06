import { useSuspenseQuery } from '@tanstack/react-query'

import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import { useRecipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import { useShoppingListStore } from '@/stores/shopping-list.store'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'

export const useShoppingList = () => {
  const shoppingList = useShoppingListStore((state) => state.shoppingList)
  const recipesQuantities = useRecipeQuantitiesStore((state) => state.recipesQuantities)

  const { data: recipes } = useSuspenseQuery(getRecipeByIdsOptions(shoppingList))

  return {
    recipesQuantities,
    shoppingListIngredients: aggregateShoppingList(recipes, recipesQuantities),
  }
}
