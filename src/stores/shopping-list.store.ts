import { persistedStore } from '@/lib/client/persisted-store'

const { store: shoppingListStore, useValue } = persistedStore<number[]>('shopping-list', [])

export const useShoppingListIds = useValue

export const addToShoppingList = (recipeId: number) => shoppingListStore.setState((list) => [...list, recipeId])

export const removeFromShoppingList = (recipeId: number) => shoppingListStore.setState((list) => list.filter((id) => id !== recipeId))

export const resetShoppingList = () => shoppingListStore.setState(() => [])
