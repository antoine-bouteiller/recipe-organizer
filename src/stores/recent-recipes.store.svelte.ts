import { persistedStore } from '@/lib/client/persisted-store.svelte'
import { pushRecentRecipe } from '@/utils/push-recent-recipe'

const { setState: setRecentRecipes, useValue } = persistedStore<number[]>('recent-recipes', [])

export const useRecentRecipeIds = useValue

export const addRecentRecipe = (recipeId: number) => setRecentRecipes((ids) => pushRecentRecipe(ids, recipeId))

export const clearRecentRecipes = () => setRecentRecipes(() => [])
