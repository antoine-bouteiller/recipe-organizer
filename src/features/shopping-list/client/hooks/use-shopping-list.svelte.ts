import { loadRecipesByIds } from '@/features/shopping-list/client/api/get-recipe-by-ids'
import { useIsHydrated } from '@/hooks/use-is-hydrated.svelte'
import { useRecipeQuantitiesState } from '@/stores/recipe-quantities.store.svelte'
import { useShoppingListIds } from '@/stores/shopping-list.store.svelte'

import { aggregateShoppingList } from '../utils/aggregate-shopping-list'
import type { ShoppingListRecipe } from '../utils/aggregate-shopping-list'

type ShoppingListState = { status: 'pending' | 'error'; recipes?: never } | { status: 'success'; recipes: readonly ShoppingListRecipe[] }

/** Call during component setup; device selections load only after browser mount. */
export const useShoppingList = () => {
  const hydrated = useIsHydrated()
  const selection = useShoppingListIds()
  const quantities = useRecipeQuantitiesState()
  let state = $state.raw<ShoppingListState>({ status: 'pending' })
  let attempt = $state(0)

  $effect(() => {
    const ids = [...selection.current]
    // A retry must rerun this effect even when the selected IDs have not changed.
    void attempt
    let active = true
    if (hydrated.current) {
      if (ids.length === 0) {
        state = { recipes: [], status: 'success' }
      } else {
        state = { status: 'pending' }
        loadRecipesByIds(ids).then(
          (recipes) => {
            if (active) {
              state = { recipes, status: 'success' }
            }
          },
          () => {
            if (active) {
              state = { status: 'error' }
            }
          }
        )
      }
    }
    return () => {
      active = false
    }
  })

  const ingredients = $derived(aggregateShoppingList(state.status === 'success' ? state.recipes : [], quantities.current))
  return {
    get current() {
      return ingredients
    },
    retry: () => {
      attempt += 1
    },
    get status() {
      return state.status
    },
  }
}
