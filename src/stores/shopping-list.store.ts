import '@tanstack/react-start/client-only'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShoppingListState {
  shoppingList: number[]
  addToShoppingList: (recipeId: number) => void
  removeFromShoppingList: (recipeId: number) => void
  resetShoppingList: () => void
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      shoppingList: [],
      addToShoppingList: (recipeId) => set(({ shoppingList }) => ({ shoppingList: [...shoppingList, recipeId] })),
      removeFromShoppingList: (recipeId) => set(({ shoppingList }) => ({ shoppingList: shoppingList.filter((id) => id !== recipeId) })),
      resetShoppingList: () => set({ shoppingList: [] }),
    }),
    {
      name: 'shopping-list',
      partialize: (state) => ({ shoppingList: state.shoppingList }),
    }
  )
)
