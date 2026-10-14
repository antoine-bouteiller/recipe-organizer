import { createQuery } from '@tanstack/svelte-query'

import { recipeListByIdsQuery } from '@/features/shopping-list/client/api/get-recipe-by-ids'
import { useIsHydrated } from '@/hooks/use-is-hydrated.svelte'
import { useRecipeQuantitiesState } from '@/stores/recipe-quantities.store.svelte'
import { useShoppingListIds } from '@/stores/shopping-list.store.svelte'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'

/** Call during component setup; device selections load only after browser mount. */
export const useShoppingList = () => {
  const hydrated = useIsHydrated()
  const selection = useShoppingListIds()
  const quantities = useRecipeQuantitiesState()
  const ids = $derived([...selection.current])
  const query = createQuery(() => ({ ...recipeListByIdsQuery(ids), enabled: hydrated.current && ids.length > 0 }))
  const status = $derived.by(() => {
    if (!hydrated.current) {
      return 'pending'
    }
    if (ids.length === 0 || query.data) {
      return 'success'
    }
    return query.isError ? 'error' : 'pending'
  })
  const recipes = $derived(ids.length > 0 && query.data ? query.data : [])

  const ingredients = $derived(aggregateShoppingList(recipes, quantities.current))
  return {
    get current() {
      return ingredients
    },
    retry: () => {
      void query.refetch()
    },
    get status() {
      return status
    },
  }
}
