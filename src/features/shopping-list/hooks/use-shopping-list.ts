import { getRecipeByIdsOptions } from '@/features/shopping-list/api/get-recipe-by-ids'
import type { Ingredient } from '@/types/ingredient'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useMemo } from 'react'
import { shoppingListStore } from '../../../stores/shopping-list.store'

export interface IngredientWithQuantity extends Ingredient {
  quantity: number
  unit: string | undefined
  checked: boolean
}
export const useShoppingListStore = () => {
  const { recipesQuantities } = useStore(shoppingListStore)

  const { data: recipes } = useQuery(
    getRecipeByIdsOptions(Object.keys(recipesQuantities).map(Number))
  )

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    wantedQuantity: recipesQuantities[recipe.id] ?? 0,
  }))

  const shoppingListIngredients = useMemo(() => {
    if (!recipesWithQuantities) {
      return {}
    }

    // First pass: collect all ingredients with their quantities
    const ingredientsMap = recipesWithQuantities
      .filter((recipe) => recipe.wantedQuantity > 0)
      .reduce<Map<number, IngredientWithQuantity>>((map, recipe) => {
        for (const section of recipe.sections) {
          for (const ingredient of section.sectionIngredients) {
            const existingIngredient = map.get(ingredient.ingredient.id)
            const calculatedQuantity =
              (ingredient.quantity * recipe.wantedQuantity) / recipe.quantity

            if (existingIngredient) {
              existingIngredient.quantity += calculatedQuantity
            } else {
              map.set(ingredient.ingredient.id, {
                ...ingredient.ingredient,
                quantity: calculatedQuantity,
                unit: ingredient.unit?.name,
                checked: false,
              })
            }
          }
        }
        return map
      }, new Map())

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
    const result: IngredientWithQuantity[] = []

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

    return result.reduce<Record<string, IngredientWithQuantity[]>>((acc, ingredient) => {
      const key = ingredient.category.toLowerCase()
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(ingredient)
      return acc
    }, {})
  }, [recipesWithQuantities])

  return {
    shoppingListIngredients,
    recipesQuantities,
  }
}
