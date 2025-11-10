import { getRecipeByIdsOptions } from '@/features/recipe/api/get-by-ids'
import { getCookie, setCookie } from '@/lib/cookie'
import type { Ingredient } from '@/types/ingredient'
import { useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Store } from '@tanstack/react-store'
import { useMemo } from 'react'

const storageKey = 'shopping-list'

interface ShoppingListState {
  recipesQuantities: Record<number, number>
}

const defaultState: ShoppingListState = {
  recipesQuantities: {},
}

export const initShoppingListState = () => {
  const state = getCookie(storageKey)

  const parsedState: ShoppingListState = state ? JSON.parse(state) : defaultState

  return parsedState
}

export const shoppingListStore = new Store(initShoppingListState(), {
  onUpdate: () => {
    setCookie(storageKey, JSON.stringify(shoppingListStore.state))
  },
})

const setRecipesQuantities = (recipeId: number, quantity: number) => {
  shoppingListStore.setState(({ recipesQuantities }) => ({
    recipesQuantities: { ...recipesQuantities, [recipeId]: quantity },
  }))
}

const reset = () => {
  shoppingListStore.setState({ recipesQuantities: {} })
}

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
    // Step 1: Aggregate all ingredients normally
    const aggregatedIngredients =
      recipesWithQuantities
        ?.filter((recipe) => recipe.wantedQuantity > 0)
        .reduce<IngredientWithQuantity[]>((acc, recipe) => {
          for (const section of recipe.sections) {
            for (const ingredient of section.sectionIngredients) {
              const existingIngredient = acc.find(
                (accIngredient) => accIngredient.id === ingredient.ingredient.id
              )
              if (existingIngredient) {
                existingIngredient.quantity +=
                  (ingredient.quantity * recipe.wantedQuantity) / recipe.quantity
              } else {
                acc.push({
                  ...ingredient.ingredient,
                  quantity: (ingredient.quantity * recipe.wantedQuantity) / recipe.quantity,
                  unit: ingredient.unit?.name,
                  checked: false,
                })
              }
            }
          }
          return acc
        }, []) || []

    // Step 2: Handle parent-child ingredient relationships
    // Group ingredients by parentId
    const childrenByParent = new Map<number, IngredientWithQuantity[]>()
    const childIds = new Set<number>()

    for (const ingredient of aggregatedIngredients) {
      if (ingredient.parentId && ingredient.factor) {
        const children = childrenByParent.get(ingredient.parentId) ?? []
        children.push(ingredient)
        childrenByParent.set(ingredient.parentId, children)
        childIds.add(ingredient.id)
      }
    }

    // Step 3: Convert children quantities to parent equivalents and aggregate
    const result: IngredientWithQuantity[] = []

    for (const ingredient of aggregatedIngredients) {
      // Skip child ingredients as they'll be aggregated into parent
      if (childIds.has(ingredient.id)) {
        continue
      }

      // Check if this ingredient has children
      const children = childrenByParent.get(ingredient.id)

      if (children && children.length > 0) {
        // Calculate parent-equivalent quantity for each child
        // For egg example: 5 yolks (factor=1) -> 5 eggs, 3 whites (factor=1) -> 3 eggs
        const childEquivalents = children.map((child) => {
          // child.quantity * child.factor gives the parent equivalent
          // e.g., if we need 5 yolks and factor is 1, we need 5 eggs
          return child.quantity * (child.factor ?? 1)
        })

        // Take the maximum of all child equivalents
        // For egg: max(5 yolks, 3 whites) = max(5, 3) = 5 eggs
        const maxChildEquivalent = Math.max(...childEquivalents)

        // Add parent's direct quantity to the max child equivalent
        // For egg: 5 (from children) + 2 (direct) = 7 eggs
        result.push({
          ...ingredient,
          quantity: ingredient.quantity + maxChildEquivalent,
        })
      } else {
        // No children, add as-is
        result.push(ingredient)
      }
    }

    return result
  }, [recipesWithQuantities])

  return {
    shoppingListIngredients,
    setRecipesQuantities,
    recipesQuantities,
    reset,
  }
}
