import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { createOptionsHook } from '@/hooks/use-options'

export const useIngredientOptions = createOptionsHook(getIngredientListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))
