import { getCookie, setCookie } from '@/utils/cookie'
import { Store } from '@tanstack/react-store'

const storageKey = 'shopping-list'

interface ShoppingListState {
  shoppingList: number[]
}

const defaultState: ShoppingListState = {
  shoppingList: [],
}

export const initShoppingListState = () => {
  const state = getCookie(storageKey)

  const parsedState: ShoppingListState = state ? JSON.parse(state) : defaultState

  return parsedState
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
