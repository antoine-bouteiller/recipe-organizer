import { getCookie, setCookie } from '@/utils/cookie'
import { Store } from '@tanstack/react-store'
import z from 'zod'

const storageKey = 'recipe-quantities'

interface RecipeQuantitiesState {
  recipesQuantities: Record<number, number>
}

const defaultState: RecipeQuantitiesState = {
  recipesQuantities: {},
}

const storeSchema = z.object({
  recipesQuantities: z.record(z.string().transform(Number), z.coerce.number()),
})

export const initRecipeQuantitiesState = () => {
  const state = getCookie(storageKey)

  if (!state) {
    return defaultState
  }

  const parsedState = storeSchema.safeParse(JSON.parse(state))

  return parsedState.success ? parsedState.data : defaultState
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
