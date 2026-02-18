import { Store } from '@tanstack/react-store'
import * as v from 'valibot'

const storageKey = 'recipe-quantities'

interface RecipeQuantitiesState {
  recipesQuantities: Record<number, number>
}

const defaultState: RecipeQuantitiesState = {
  recipesQuantities: {},
}

const storeSchema = v.pipe(
  v.string(),
  v.transform((s) => {
    try {
      return JSON.parse(s) as unknown
    } catch {
      return null
    }
  }),
  v.object({ recipesQuantities: v.record(v.string(), v.number()) })
)

const initRecipeQuantitiesState = () => {
  const state = localStorage.getItem(storageKey)

  if (!state) {
    return defaultState
  }

  const result = v.safeParse(storeSchema, state)

  if (!result.success) {
    return defaultState
  }

  // Convert string keys back to numbers
  const recipesQuantities: Record<number, number> = {}
  for (const [key, value] of Object.entries(result.output.recipesQuantities)) {
    recipesQuantities[Number(key)] = value
  }

  return { recipesQuantities }
}

export const recipeQuantitiesStore = new Store(initRecipeQuantitiesState(), {
  onUpdate: () => {
    localStorage.setItem(storageKey, JSON.stringify(recipeQuantitiesStore.state))
  },
})

export const setRecipesQuantities = (recipeId: number, quantity: number) => {
  recipeQuantitiesStore.setState(({ recipesQuantities }) => ({
    recipesQuantities: { ...recipesQuantities, [recipeId]: quantity },
  }))
}
