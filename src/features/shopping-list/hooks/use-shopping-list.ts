import { useSuspenseQuery } from '@tanstack/react-query'

import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import { useRecipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import type { IngredientCategory } from '@/types/ingredient'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'

import { useShoppingListStore } from '../../../stores/shopping-list.store'
import type { IngredientCartItem } from '../types/ingredient-cart-item'

export const useShoppingList = () => {
  const shoppingList = useShoppingListStore((state) => state.shoppingList)
  const recipesQuantities = useRecipeQuantitiesStore((state) => state.recipesQuantities)

  const { data: recipes } = useSuspenseQuery(getRecipeByIdsOptions(shoppingList))

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    wantedQuantity: isNullOrUndefined(recipesQuantities[recipe.id]) ? recipe.servings : recipesQuantities[recipe.id],
  }))

  let shoppingListIngredients: Partial<Record<IngredientCategory, IngredientCartItem[]>> = {}

  if (recipesWithQuantities) {
    const ingredientsMap = recipesWithQuantities.reduce<Map<number, IngredientCartItem>>((map, recipe) => {
      for (const ingredient of recipe.ingredients) {
        const existingIngredient = map.get(ingredient.id)
        const calculatedQuantity = (ingredient.quantity * recipe.wantedQuantity) / recipe.servings

        if (existingIngredient) {
          existingIngredient.quantity += calculatedQuantity
        } else {
          map.set(ingredient.id, {
            ...ingredient,
            checked: false,
            quantity: calculatedQuantity,
            unit: ingredient.unit,
          })
        }
      }
      return map
    }, new Map())

    const parentQuantities = new Map<number, number>()
    const childrenIds = new Set<number>()

    for (const ingredient of ingredientsMap.values()) {
      if (ingredient.parentId) {
        childrenIds.add(ingredient.id)
        const currentMax = parentQuantities.get(ingredient.parentId) || 0

        parentQuantities.set(ingredient.parentId, Math.max(currentMax, ingredient.quantity))
      }
    }

    const result: IngredientCartItem[] = []

    for (const ingredient of ingredientsMap.values().filter((item) => !childrenIds.has(item.id))) {
      const parentQuantity = parentQuantities.get(ingredient.id)

      if (parentQuantity) {
        result.push({
          ...ingredient,
          quantity: parentQuantity + ingredient.quantity,
        })
      } else {
        result.push(ingredient)
      }
    }

    shoppingListIngredients = result.reduce<Partial<Record<IngredientCategory, IngredientCartItem[]>>>((acc, ingredient) => {
      const key = ingredient.category
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(ingredient)
      return acc
    }, {})
  }

  return {
    recipesQuantities,
    shoppingListIngredients,
  }
}
