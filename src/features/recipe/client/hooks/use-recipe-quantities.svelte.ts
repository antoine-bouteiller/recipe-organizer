import { setRecipesQuantities, useRecipeQuantitiesState } from '@/stores/recipe-quantities.store.svelte'
import { isNullOrUndefined } from '@/utils/is-null-or-undefined'

/** Call at setup; getter inputs follow a recipe replaced in an already-mounted component. */
export const useRecipeQuantities = (
  recipeId: () => number | undefined = () => undefined,
  defaultValue: () => number | undefined = () => undefined
) => {
  const quantities = useRecipeQuantitiesState()
  const quantity = $derived.by(() => {
    const id = recipeId()
    return isNullOrUndefined(id) || isNullOrUndefined(quantities.current[id]) ? (defaultValue() ?? 0) : quantities.current[id]
  })
  const adjust = (delta: number) => {
    const id = recipeId()
    if (!isNullOrUndefined(id)) {
      setRecipesQuantities(id, quantity + delta)
    }
  }
  return {
    decrementQuantity: () => adjust(-1),
    incrementQuantity: () => adjust(1),
    get quantity() {
      return quantity
    },
  }
}
