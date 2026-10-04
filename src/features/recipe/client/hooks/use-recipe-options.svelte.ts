import { useRecipeCatalog } from '@/features/recipe/client/contexts/recipe-catalog-context.svelte'
import { createOptionsHook } from '@/hooks/use-options.svelte'

export const useRecipeOptions = createOptionsHook(useRecipeCatalog, (item) => ({ label: item.name, value: item.id }))
