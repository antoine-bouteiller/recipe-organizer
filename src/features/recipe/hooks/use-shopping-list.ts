import { shoppingListStore } from '@/stores/shopping-list.store'
import { useStore } from '@tanstack/react-store'

export const useShoppingList = (recipeId: number) => {
  const { recipesQuantities } = useStore(shoppingListStore)

  return recipesQuantities[recipeId]
}
