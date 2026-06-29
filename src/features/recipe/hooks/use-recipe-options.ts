import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { createOptionsHook } from '@/hooks/use-options'

export const useRecipeOptions = createOptionsHook(getRecipeListOptions, (item) => ({
  label: item.name,
  value: item.id,
}))
