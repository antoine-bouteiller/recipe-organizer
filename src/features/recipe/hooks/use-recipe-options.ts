import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { createOptionsHook } from '@/hooks/use-options'
import { type ReducedRecipe } from '@/types/recipe'

export const useRecipeOptions = createOptionsHook(getRecipeListOptions, (item: ReducedRecipe) => ({
  label: item.name,
  value: item.id,
}))
