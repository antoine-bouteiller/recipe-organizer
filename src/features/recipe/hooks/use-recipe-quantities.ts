import { recipeQuantitiesStore, setRecipesQuantities } from '@/stores/recipe-quantities.store'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'
import { useStore } from '@tanstack/react-store'

export const useRecipeQuantities = (recipeId?: number, defaultValue?: number) => {
  const { recipesQuantities } = useStore(recipeQuantitiesStore)

  const quantity =
    isNullOrUndefined(recipeId) || isNullOrUndefined(recipesQuantities[recipeId])
      ? (defaultValue ?? 0)
      : recipesQuantities[recipeId]

  const incrementQuantity = () => {
    if (isNullOrUndefined(recipeId)) {
      return
    }
    setRecipesQuantities(recipeId, quantity + 1)
  }

  const decrementQuantity = () => {
    if (isNullOrUndefined(recipeId)) {
      return
    }
    setRecipesQuantities(recipeId, quantity - 1)
  }

  return {
    quantity,
    incrementQuantity,
    decrementQuantity,
  }
}
