import { persistedStore } from '@client/lib/persisted-store'
import { pushRecentRecipe } from '@client/utils/push-recent-recipe'

const { store: recentRecipesStore, useValue } = persistedStore<number[]>('recent-recipes', [])

export const useRecentRecipeIds = useValue

export const addRecentRecipe = (recipeId: number) => recentRecipesStore.setState((ids) => pushRecentRecipe(ids, recipeId))

export const clearRecentRecipes = () => recentRecipesStore.setState(() => [])
