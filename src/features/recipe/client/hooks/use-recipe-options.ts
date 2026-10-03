import { useRecipeCatalog } from '@/features/recipe/client/contexts/recipe-catalog-context'
import { createOptionsHook } from '@/hooks/use-options'

export const useRecipeOptions = createOptionsHook(useRecipeCatalog, (item) => ({
  label: item.name,
  value: item.id,
}))
