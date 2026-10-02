import { useRecipeCatalog } from '@client/features/recipe/contexts/recipe-catalog-context'
import { createOptionsHook } from '@client/hooks/use-options'

export const useRecipeOptions = createOptionsHook(useRecipeCatalog, (item) => ({
  label: item.name,
  value: item.id,
}))
