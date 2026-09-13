import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { createOptionsHook } from '@client/hooks/use-options'

export const useRecipeOptions = createOptionsHook(getRecipeListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))
