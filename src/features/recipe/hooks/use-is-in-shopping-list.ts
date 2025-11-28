import { shoppingListStore } from '@/stores/shopping-list.store'
import { useStore } from '@tanstack/react-store'

export const useIsInShoppingList = (recipeId: number) => {
  const { shoppingList } = useStore(shoppingListStore)

  return shoppingList.includes(recipeId)
}
