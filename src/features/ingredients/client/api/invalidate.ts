import type { QueryClient } from '@tanstack/svelte-query'

import { queryKeys } from '@/lib/client/query-keys'

/** Recipe details and shopping-list rows embed ingredient names. */
export const invalidateIngredients = (client: QueryClient) =>
  Promise.all([client.invalidateQueries({ queryKey: queryKeys.allIngredients }), client.invalidateQueries({ queryKey: queryKeys.allRecipes })])
