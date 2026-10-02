import { persistedStore } from '@client/lib/persisted-store'

const { store: recipeQuantitiesStore, useValue } = persistedStore<Record<number, number>>('recipe-quantities', {})

export const useRecipeQuantitiesState = useValue

export const setRecipesQuantities = (recipeId: number, quantity: number) =>
  recipeQuantitiesStore.setState((quantities) => ({ ...quantities, [recipeId]: quantity }))
