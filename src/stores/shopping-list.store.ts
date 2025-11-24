import { getCookie, setCookie } from '@/utils/cookie'
import { Store } from '@tanstack/react-store'

const storageKey = 'shopping-list'

interface ShoppingListState {
  recipesQuantities: Record<number, number>
}

const defaultState: ShoppingListState = {
  recipesQuantities: {},
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

export const setRecipesQuantities = (recipeId: number, quantity: number) => {
  shoppingListStore.setState(({ recipesQuantities }) => ({
    recipesQuantities: { ...recipesQuantities, [recipeId]: quantity },
  }))
}

export const resetShoppingList = () => {
  shoppingListStore.setState({ recipesQuantities: {} })
}
