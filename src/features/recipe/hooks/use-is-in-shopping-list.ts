import { shoppingListStore } from '@/stores/shopping-list.store'
import { useStore } from '@tanstack/react-store'
import { useMemo } from 'react'

export const useIsInShoppingList = (recipeId: number) => {
  const { shoppingList } = useStore(shoppingListStore)

  const isInShoppingList = useMemo(
    () => shoppingList.some((item) => item === recipeId),
    [shoppingList, recipeId]
  )

  return isInShoppingList
}
