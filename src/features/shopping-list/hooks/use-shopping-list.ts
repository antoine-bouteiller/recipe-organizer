import { useQuery } from '@tanstack/react-query'

import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import { type IngredientCartItem } from '@/features/shopping-list/types/ingredient-cart-item'
import { useRecipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import { useShoppingListStore } from '@/stores/shopping-list.store'
import { type IngredientCategory } from '@/types/ingredient'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'

type UseShoppingListResult =
  | {
      isLoading: true
      recipesQuantities?: never
      shoppingListIngredients?: never
    }
  | {
      isLoading: false
      recipesQuantities: Record<number, number>
      shoppingListIngredients: Partial<Record<IngredientCategory, IngredientCartItem[]>>
    }

export const useShoppingList = (): UseShoppingListResult => {
  const shoppingList = useShoppingListStore((state) => state.shoppingList)
  const recipesQuantities = useRecipeQuantitiesStore((state) => state.recipesQuantities)

  const { data: recipes, isLoading } = useQuery(getRecipeByIdsOptions(shoppingList))

  if (isLoading) {
    return {
      isLoading,
    }
  }

  return {
    isLoading,
    recipesQuantities,
    shoppingListIngredients: aggregateShoppingList(recipes ?? [], recipesQuantities),
  }
}
