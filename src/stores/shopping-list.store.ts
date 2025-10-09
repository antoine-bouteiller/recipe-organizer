import { useGetRecipesByIds } from '@/features/recipe/api/get-by-ids'
import type { Ingredient } from '@/types/ingredient'
import { useMemo } from 'react'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'

interface ShoppingListStore {
  recipesQuantities: Record<number, number>
  setRecipesQuantities: (key: number, value: number) => void
  reset: () => void
}

const shoppingListStore = createStore<ShoppingListStore>()(
  persist(
    immer((set) => ({
      recipesQuantities: {},
      setRecipesQuantities: (key, value) =>
        set((state) => {
          state.recipesQuantities[key] = value
        }),
      reset: () =>
        set((state) => {
          state.recipesQuantities = {}
        }),
    })),
    {
      name: 'shoping-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export interface IngredientWithQuantity extends Ingredient {
  quantity: number
  unit: string | null
  checked: boolean
}

export const useShoppingListStore = () => {
  const { recipesQuantities, setRecipesQuantities, reset } = useStore(shoppingListStore)

  const { data: recipes } = useGetRecipesByIds(Object.keys(recipesQuantities).map(Number))

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    wantedQuantity: recipesQuantities[recipe.id],
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
                  unit: ingredient.unit,
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
