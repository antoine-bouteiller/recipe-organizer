import { useIngredientCatalog } from '@/features/ingredients/client/contexts/ingredient-catalog-context.svelte.ts'
import { createOptionsHook } from '@/hooks/use-options.svelte'

export const useIngredientOptions = createOptionsHook(useIngredientCatalog, (item) => ({
  label: item.name,
  value: item.id,
}))
