import * as z from 'zod'

export const recipeIdParamsSchema = z.object({ id: z.coerce.number() })
