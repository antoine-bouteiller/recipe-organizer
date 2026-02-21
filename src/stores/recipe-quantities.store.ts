import '@tanstack/react-start/client-only'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecipeQuantitiesState {
  recipesQuantities: Record<number, number>
  setRecipesQuantities: (recipeId: number, quantity: number) => void
}

export const useRecipeQuantitiesStore = create<RecipeQuantitiesState>()(
  persist(
    (set) => ({
      recipesQuantities: {},
      setRecipesQuantities: (recipeId, quantity) =>
        set(({ recipesQuantities }) => ({
          recipesQuantities: { ...recipesQuantities, [recipeId]: quantity },
        })),
    }),
    {
      name: 'recipe-quantities',
      partialize: (state) => ({ recipesQuantities: state.recipesQuantities }),
    }
  )
)
