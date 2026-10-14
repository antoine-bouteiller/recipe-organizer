import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import type { RecipeFormInput } from '@/features/recipe/schemas'
import { readResponse } from '@/lib/client/api-client'
import { queryKeys } from '@/lib/client/query-keys'

export type { RecipeFormInput } from '@/features/recipe/schemas'

export const createRecipeMutation = () =>
  mutationOptions({
    mutationFn: (body: FormData | RecipeFormInput) =>
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- void/client sends FormData as multipart; its body type only models JSON.
      readResponse(fetch('/api/recipes', { body: body as RecipeFormInput, method: 'POST' })),
    onSuccess: (_data, _variables, _result, { client }) => client.invalidateQueries({ queryKey: queryKeys.allRecipes }),
  })
