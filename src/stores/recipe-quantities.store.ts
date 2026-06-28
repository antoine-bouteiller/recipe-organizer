import { useSelector } from '@tanstack/react-store'

import { persistedStore } from '@/lib/persisted-store'

const recipeQuantitiesStore = persistedStore<Record<number, number>>('recipe-quantities', {})

export const useRecipeQuantitiesState = () => useSelector(recipeQuantitiesStore)

export const setRecipesQuantities = (recipeId: number, quantity: number) =>
  recipeQuantitiesStore.setState((quantities) => ({ ...quantities, [recipeId]: quantity }))
