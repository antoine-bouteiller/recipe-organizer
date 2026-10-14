import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const deleteRecipeMutation = () =>
  mutationOptions({
    mutationFn: (id: number) => readResponse(fetch('/api/recipes/:id', { method: 'DELETE', params: { id: String(id) } })),
    onSuccess: (_data, id, _result, { client }) => {
      // The open detail screen would otherwise refetch the deleted recipe before navigating away.
      client.removeQueries({ queryKey: queryKeys.recipeDetail(id) })
      return client.invalidateQueries({ queryKey: queryKeys.allRecipes })
    },
  })
