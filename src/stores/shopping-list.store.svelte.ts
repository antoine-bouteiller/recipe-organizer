import { persistedStore } from '@/lib/client/persisted-store.svelte'

const { setState: setShoppingList, useValue } = persistedStore<number[]>('shopping-list', [])

export const useShoppingListIds = useValue

export const addToShoppingList = (recipeId: number) => setShoppingList((list) => [...list, recipeId])

export const removeFromShoppingList = (recipeId: number) => setShoppingList((list) => list.filter((id) => id !== recipeId))

export const resetShoppingList = () => setShoppingList(() => [])
