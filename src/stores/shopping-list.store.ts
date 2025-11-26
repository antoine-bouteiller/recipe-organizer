import { getCookie, setCookie } from '@/utils/cookie'
import { Store } from '@tanstack/react-store'
import z from 'zod'

const storageKey = 'shopping-list'

interface ShoppingListState {
  shoppingList: number[]
}

const defaultState: ShoppingListState = {
  shoppingList: [],
}

const storeSchema = z.object({
  shoppingList: z.array(z.number()),
})

export const initShoppingListState = () => {
  const state = getCookie(storageKey)

  if (!state) {
    return defaultState
  }

  const parsedState = storeSchema.safeParse(JSON.parse(state))

  return parsedState.success ? parsedState.data : defaultState
}

export const shoppingListStore = new Store(initShoppingListState(), {
  onUpdate: () => {
    setCookie(storageKey, JSON.stringify(shoppingListStore.state))
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
