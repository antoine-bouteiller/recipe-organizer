import { getCookie, setCookie } from '@/utils/cookie'
import { Store } from '@tanstack/react-store'

const storageKey = 'recipe-quantities'

interface RecipeQuantitiesState {
  recipesQuantities: Record<number, number>
}

const defaultState: RecipeQuantitiesState = {
  recipesQuantities: {},
}

export const initRecipeQuantitiesState = () => {
  const state = getCookie(storageKey)

  const parsedState: RecipeQuantitiesState = state ? JSON.parse(state) : defaultState

  return parsedState
}

export const recipeQuantitiesStore = new Store(initRecipeQuantitiesState(), {
  onUpdate: () => {
    setCookie(storageKey, JSON.stringify(recipeQuantitiesStore.state))
  },
})

export const setRecipesQuantities = (recipeId: number, quantity: number) => {
  recipeQuantitiesStore.setState(({ recipesQuantities }) => ({
    recipesQuantities: { ...recipesQuantities, [recipeId]: quantity },
  }))
}
