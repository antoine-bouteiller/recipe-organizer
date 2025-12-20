import { Store } from '@tanstack/react-store'
import { type } from 'arktype'

import { getCookie, setCookie } from '@/utils/cookie'

const storageKey = 'shopping-list'

interface ShoppingListState {
  shoppingList: number[]
}

const defaultState: ShoppingListState = {
  shoppingList: [],
}

const storeSchema = type('string')
  .pipe.try((s): object => JSON.parse(s))
  .to({
    shoppingList: 'number[]',
  })

export const initShoppingListState = () => {
  const state = getCookie(storageKey)

  if (!state) {
    return defaultState
  }

  const parsedState = storeSchema(state)

  return parsedState instanceof type.errors ? defaultState : parsedState
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
