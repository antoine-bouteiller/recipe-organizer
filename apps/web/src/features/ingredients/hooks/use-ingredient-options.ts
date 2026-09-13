import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { createOptionsHook } from '@client/hooks/use-options'

export const useIngredientOptions = createOptionsHook(getIngredientListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))
