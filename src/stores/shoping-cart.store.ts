import { getRecipesByIdsQueryOptions } from '@/features/recipe/api/get-by-ids'
import type { Ingredient } from '@/types/ingredient'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'

interface ShopingListStore {
  recipesQuantities: Record<number, number>
  setRecipesQuantities: (key: number, value: number) => void
  reset: () => void
}

const shopingListStore = createStore<ShopingListStore>()(
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

export const useShopingListStore = () => {
  const { recipesQuantities, setRecipesQuantities, reset } = useStore(shopingListStore)

  const { data: recipes } = useQuery({
    ...getRecipesByIdsQueryOptions(Object.keys(recipesQuantities).map(Number)),
  })

  const recipesWithQuantities = recipes?.map((recipe) => ({
    ...recipe,
    quantity: recipesQuantities[recipe.id],
  }))

  const shoppingListIngredients = useMemo(
    () =>
      recipesWithQuantities?.reduce<IngredientWithQuantity[]>((acc, recipe) => {
        for (const section of recipe.sections) {
          for (const ingredient of section.sectionIngredients) {
            const existingIngredient = acc.find(
              (accIngredient) => accIngredient.id === ingredient.ingredient.id
            )
            if (existingIngredient) {
              existingIngredient.quantity += ingredient.quantity
            } else {
              acc.push({
                ...ingredient.ingredient,
                quantity: ingredient.quantity,
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
