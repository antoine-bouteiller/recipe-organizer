import { persistedStore } from '@client/lib/persisted-store'
import { pushRecentRecipe } from '@client/utils/push-recent-recipe'
import { useSelector } from '@tanstack/react-store'

const recentRecipesStore = persistedStore<number[]>('recent-recipes', [])

export const useRecentRecipeIds = () => useSelector(recentRecipesStore)

export const addRecentRecipe = (recipeId: number) => recentRecipesStore.setState((ids) => pushRecentRecipe(ids, recipeId))

export const clearRecentRecipes = () => recentRecipesStore.setState(() => [])
