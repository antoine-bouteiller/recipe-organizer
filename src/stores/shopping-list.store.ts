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

  const shoppingListIngredients = useMemo(
    () =>
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
        }, []) || [],
    [recipesWithQuantities]
  )

  return {
    shoppingListIngredients,
    setRecipesQuantities,
    recipesQuantities,
    reset,
  }
}
