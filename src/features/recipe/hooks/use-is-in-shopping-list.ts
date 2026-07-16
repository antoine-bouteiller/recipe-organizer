import { useShoppingListIds } from '@/stores/shopping-list.store'

export const useIsInShoppingList = (recipeId: number) => {
  const shoppingList = useShoppingListIds()

  return () => shoppingList().includes(recipeId)
}
