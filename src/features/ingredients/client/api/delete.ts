import { mutationOptions } from '@tanstack/svelte-query'
import { fetch } from 'void/client'

import { readResponse } from '@/lib/client/api-client'

import { invalidateIngredients } from './invalidate'

export const deleteIngredientMutation = () =>
  mutationOptions({
    mutationFn: (id: number) => readResponse(fetch('/api/ingredients/:id', { method: 'DELETE', params: { id: String(id) } })),
    onSuccess: (_data, _variables, _result, { client }) => invalidateIngredients(client),
  })
