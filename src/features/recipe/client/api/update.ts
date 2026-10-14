import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import type { UpdateRecipeFormInput } from '@/features/recipe/schemas'
import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export const updateRecipeMutation = (id: number) =>
  mutationOptions({
    mutationFn: (body: FormData | UpdateRecipeFormInput) =>
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- void/client sends FormData as multipart; its body type only models JSON.
      readResponse(fetch('/api/recipes/:id', { body: body as UpdateRecipeFormInput, method: 'PUT', params: { id: String(id) } })),
    onSuccess: (_data, _variables, _result, { client }) => client.invalidateQueries({ queryKey: queryKeys.allRecipes }),
  })
