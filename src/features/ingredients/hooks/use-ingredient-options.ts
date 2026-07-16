import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { createOptionsHook } from '@/hooks/use-options'
import { type Ingredient } from '@/types/ingredient'

export const useIngredientOptions = createOptionsHook(getIngredientListOptions, (item: Ingredient) => ({
  label: item.name,
  value: item.id,
}))
