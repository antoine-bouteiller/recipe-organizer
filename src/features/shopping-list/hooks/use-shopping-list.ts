import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import type { IngredientCategory } from '@/types/ingredient'
import { typedEntriesOf } from '@/utils/object'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useMemo } from 'react'
import { shoppingListStore } from '../../../stores/shopping-list.store'
import type { IngredientCartItem } from '../types/ingredient-cart-item'

export const useShoppingListStore = () => {
  const { recipesQuantities } = useStore(shoppingListStore)

  const wantedRecipes = useMemo(
    () =>
      typedEntriesOf(recipesQuantities)
        .filter(([_id, recipe]) => recipe > 0)
        .map(([id]) => id),
    [recipesQuantities]
  )

  const { data: recipes } = useQuery(getRecipeByIdsOptions(wantedRecipes))

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    wantedQuantity: recipesQuantities[recipe.id] ?? 0,
  }))

  const shoppingListIngredients = useMemo(() => {
    if (!recipesWithQuantities) {
      return {}
    }

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

    return result.reduce<Partial<Record<IngredientCategory, IngredientCartItem[]>>>(
      (acc, ingredient) => {
        const key = ingredient.category
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(ingredient)
        return acc
      },
      {}
    )
  }, [recipesWithQuantities])

  return {
    shoppingListIngredients,
    recipesQuantities,
  }
}
