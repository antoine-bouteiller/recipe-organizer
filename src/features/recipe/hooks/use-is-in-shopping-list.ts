import { useShoppingListStore } from '@/stores/shopping-list.store'

export const useIsInShoppingList = (recipeId: number) => {
  const shoppingList = useShoppingListStore((state) => state.shoppingList)

  return shoppingList.includes(recipeId)
}
