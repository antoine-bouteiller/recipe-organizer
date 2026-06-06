import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT_RECIPES = 10

interface RecentRecipesState {
  recentRecipeIds: number[]
  addRecentRecipe: (recipeId: number) => void
}

export const useRecentRecipesStore = create<RecentRecipesState>()(
  persist(
    (set) => ({
      addRecentRecipe: (recipeId) =>
        set(({ recentRecipeIds }) => ({
          recentRecipeIds: [recipeId, ...recentRecipeIds.filter((id) => id !== recipeId)].slice(0, MAX_RECENT_RECIPES),
        })),
      recentRecipeIds: [],
    }),
    {
      name: 'recent-recipes',
      partialize: (state) => ({ recentRecipeIds: state.recentRecipeIds }),
    }
  )
)
