import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import { recipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import type { IngredientCategory } from '@/types/ingredient'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { shoppingListStore } from '../../../stores/shopping-list.store'
import type { IngredientCartItem } from '../types/ingredient-cart-item'

export const useShoppingListStore = () => {
  const { shoppingList } = useStore(shoppingListStore)
  const { recipesQuantities } = useStore(recipeQuantitiesStore)

  const { data: recipes } = useQuery(getRecipeByIdsOptions(shoppingList))

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    wantedQuantity: isNullOrUndefined(recipesQuantities[recipe.id])
      ? recipe.quantity
      : recipesQuantities[recipe.id],
  }))

  let shoppingListIngredients: Partial<Record<IngredientCategory, IngredientCartItem[]>> = {}

  if (recipesWithQuantities) {
    // First pass: collect all ingredients with their quantities
    const ingredientsMap = recipesWithQuantities.reduce<Map<number, IngredientCartItem>>(
      (map, recipe) => {
        for (const ingredient of recipe.ingredients) {
          const existingIngredient = map.get(ingredient.id)
          const calculatedQuantity = (ingredient.quantity * recipe.wantedQuantity) / recipe.quantity

          if (existingIngredient) {
            existingIngredient.quantity += calculatedQuantity
          } else {
            map.set(ingredient.id, {
              ...ingredient,
              quantity: calculatedQuantity,
              unit: ingredient.unit,
              checked: false,
            })
          }
        }
        return map
      },
      new Map()
    )

    // Second pass: group by parentId and consolidate
    const parentQuantities = new Map<number, number>()
    const childrenIds = new Set<number>()

    for (const ingredient of ingredientsMap.values()) {
      if (ingredient.parentId) {
        childrenIds.add(ingredient.id)
        const currentMax = parentQuantities.get(ingredient.parentId) || 0

        parentQuantities.set(ingredient.parentId, Math.max(currentMax, ingredient.quantity))
      }
    }

    // Third pass: build final list
    const result: IngredientCartItem[] = []

    for (const ingredient of ingredientsMap
      .values()
      .filter((ingredient) => !childrenIds.has(ingredient.id))) {
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

    shoppingListIngredients = result.reduce<
      Partial<Record<IngredientCategory, IngredientCartItem[]>>
    >((acc, ingredient) => {
      const key = ingredient.category
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(ingredient)
      return acc
    }, {})
  }

  return {
    shoppingListIngredients,
    recipesQuantities,
  }
}
