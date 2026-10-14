import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import type { IngredientFormInput } from '@/features/ingredients/schemas'
import { readResponse } from '@/lib/client/api-client'

import { invalidateIngredients } from './invalidate'

export const updateIngredientMutation = (id: number) =>
  mutationOptions({
    mutationFn: (body: IngredientFormInput) => readResponse(fetch('/api/ingredients/:id', { body, method: 'PUT', params: { id: String(id) } })),
    onSuccess: (_data, _variables, _result, { client }) => invalidateIngredients(client),
  })
