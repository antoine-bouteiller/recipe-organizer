import { Store } from '@tanstack/react-store'
import * as v from 'valibot'

const storageKey = 'shopping-list'

interface ShoppingListState {
  shoppingList: number[]
}

const defaultState: ShoppingListState = {
  shoppingList: [],
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
  v.object({ shoppingList: v.array(v.number()) })
)

const initShoppingListState = () => {
  const state = localStorage.getItem(storageKey)

  if (!state) {
    return defaultState
  }

  const result = v.safeParse(storeSchema, state)

  return result.success ? result.output : defaultState
}

export const shoppingListStore = new Store(initShoppingListState(), {
  onUpdate: () => {
    localStorage.setItem(storageKey, JSON.stringify(shoppingListStore.state))
  },
})

export const addToShoppingList = (recipeId: number) => {
  shoppingListStore.setState(({ shoppingList: recipesQuantities }) => ({
    shoppingList: [...recipesQuantities, recipeId],
  }))
}

export const removeFromShoppingList = (recipeId: number) => {
  shoppingListStore.setState(({ shoppingList: recipesQuantities }) => ({
    shoppingList: recipesQuantities.filter((id) => id !== recipeId),
  }))
}
export const resetShoppingList = () => {
  shoppingListStore.setState({ shoppingList: [] })
}
