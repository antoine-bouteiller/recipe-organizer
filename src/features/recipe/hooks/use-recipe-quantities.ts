import { recipeQuantitiesStore, setRecipesQuantities } from '@/stores/recipe-quantities.store'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'
import { useStore } from '@tanstack/react-store'
import { useMemo } from 'react'

export const useRecipeQuantities = (recipeId?: number, defaultValue?: number) => {
  const { recipesQuantities } = useStore(recipeQuantitiesStore)

  const quantity = useMemo(() => {
    if (isNullOrUndefined(recipeId) || isNullOrUndefined(recipesQuantities[recipeId])) {
      return defaultValue ?? 0
    }
    return recipesQuantities[recipeId]
  }, [recipesQuantities, recipeId, defaultValue])

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
