import { useIngredientCatalog } from '@client/features/ingredients/contexts/ingredient-catalog-context'
import { createOptionsHook } from '@client/hooks/use-options'

export const useIngredientOptions = createOptionsHook(useIngredientCatalog, (item) => ({
  label: item.name,
  value: item.id,
}))
