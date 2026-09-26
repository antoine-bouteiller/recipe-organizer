import type { apiClient } from '@client/lib/api-client'
import type { InferResponseType } from 'hono/client'

export type ReducedRecipe = InferResponseType<typeof apiClient.recipes.$get>[number]
