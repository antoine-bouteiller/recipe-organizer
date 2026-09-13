import { type apiClient } from '@client/lib/api-client'
import { type InferResponseType } from 'hono/client'

export type Ingredient = InferResponseType<typeof apiClient.ingredients.$get>[number]
