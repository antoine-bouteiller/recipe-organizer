import { useSelector } from '@tanstack/react-store'

import { persistedStore } from '@/lib/persisted-store'

const shoppingListStore = persistedStore<number[]>('shopping-list', [])

export const useShoppingListIds = () => useSelector(shoppingListStore)

export const addToShoppingList = (recipeId: number) => shoppingListStore.setState((list) => [...list, recipeId])

export const removeFromShoppingList = (recipeId: number) => shoppingListStore.setState((list) => list.filter((id) => id !== recipeId))

export const resetShoppingList = () => shoppingListStore.setState(() => [])
