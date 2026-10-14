import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import type { IngredientFormInput } from '@/features/ingredients/schemas'
import { readResponse } from '@/lib/client/api-client'

import { invalidateIngredients } from './invalidate'

export const createIngredientMutation = () =>
  mutationOptions({
    mutationFn: (body: IngredientFormInput) => readResponse(fetch('/api/ingredients', { body, method: 'POST' })),
    onSuccess: (_data, _variables, _result, { client }) => invalidateIngredients(client),
  })
