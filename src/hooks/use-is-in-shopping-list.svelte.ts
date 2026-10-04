import { useShoppingListIds } from '@/stores/shopping-list.store.svelte'

/** Call during component setup; `recipeId` is a getter so the result follows prop changes. */
export const useIsInShoppingList = (recipeId: () => number) => {
  const shoppingList = useShoppingListIds()
  const isInList = $derived(shoppingList.current.includes(recipeId()))
  return {
    get current() {
      return isInList
    },
  }
}
