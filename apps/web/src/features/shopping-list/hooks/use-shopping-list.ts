import { getRecipeByIdsOptions } from '@client/features/shopping-list/api/get-recipe-by-ids'
import { type IngredientCartItem } from '@client/features/shopping-list/types/ingredient-cart-item'
import { useRecipeQuantitiesState } from '@client/stores/recipe-quantities.store'
import { useShoppingListIds } from '@client/stores/shopping-list.store'
import { type IngredientCategory } from '@recipe-organizer/shared/ingredients/categories'
import { useQuery } from '@tanstack/react-query'

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
  const shoppingList = useShoppingListIds()
  const recipesQuantities = useRecipeQuantitiesState()

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
