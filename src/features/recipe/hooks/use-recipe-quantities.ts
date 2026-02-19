import { useRecipeQuantitiesStore } from '@/stores/recipe-quantities.store'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'

export const useRecipeQuantities = (recipeId?: number, defaultValue?: number) => {
  const recipesQuantities = useRecipeQuantitiesStore((state) => state.recipesQuantities)
  const setRecipesQuantities = useRecipeQuantitiesStore((state) => state.setRecipesQuantities)

  const quantity = isNullOrUndefined(recipeId) || isNullOrUndefined(recipesQuantities[recipeId]) ? (defaultValue ?? 0) : recipesQuantities[recipeId]

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
    decrementQuantity,
    incrementQuantity,
    quantity,
  }
}
