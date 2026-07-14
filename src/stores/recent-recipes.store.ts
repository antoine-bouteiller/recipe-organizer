import { useSelector } from '@tanstack/solid-store'

import { persistedStore } from '@/lib/persisted-store'

const MAX_RECENT_RECIPES = 10

export const recentRecipesStore = persistedStore<number[]>('recent-recipes', [])

export const useRecentRecipeIds = () => useSelector(recentRecipesStore)

export const addRecentRecipe = (recipeId: number) =>
  recentRecipesStore.setState((ids) => [recipeId, ...ids.filter((id) => id !== recipeId)].slice(0, MAX_RECENT_RECIPES))

export const clearRecentRecipes = () => recentRecipesStore.setState(() => [])
