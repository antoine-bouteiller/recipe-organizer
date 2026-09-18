import { useShoppingListIds } from '@client/stores/shopping-list.store'

export const useIsInShoppingList = (recipeId: number) => {
  const shoppingList = useShoppingListIds()

  return shoppingList.includes(recipeId)
}
