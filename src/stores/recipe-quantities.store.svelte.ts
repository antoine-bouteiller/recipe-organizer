import { persistedStore } from '@/lib/client/persisted-store.svelte'

const { setState: setRecipeQuantities, useValue } = persistedStore<Record<number, number>>('recipe-quantities', {})

export const useRecipeQuantitiesState = useValue

export const setRecipesQuantities = (recipeId: number, quantity: number) =>
  setRecipeQuantities((quantities) => ({ ...quantities, [recipeId]: quantity }))
