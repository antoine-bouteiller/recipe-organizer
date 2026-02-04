import { Store } from '@tanstack/react-store'
import { type } from 'arktype'

const storageKey = 'recipe-quantities'

interface RecipeQuantitiesState {
  recipesQuantities: Record<number, number>
}

const defaultState: RecipeQuantitiesState = {
  recipesQuantities: {},
}

const storeSchema = type('string')
  .pipe.try((s): object => JSON.parse(s))
  .to({
    recipesQuantities: 'Record<string, number>',
  })

export const initRecipeQuantitiesState = () => {
  const state = localStorage.getItem(storageKey)

  if (!state) {
    return defaultState
  }

  const validated = storeSchema(state)

  if (validated instanceof type.errors) {
    return defaultState
  }

  // Convert string keys back to numbers
  const recipesQuantities: Record<number, number> = {}
  for (const [key, value] of Object.entries(validated.recipesQuantities)) {
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
