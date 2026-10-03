import { defineHandler } from 'void'

import { ingredient } from '@/db/schema'
import { ingredientSchema } from '@/features/ingredients/schemas'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: ingredientSchema.partial().pipe(ingredientSchema) })(async (_context, { body }) => {
    await getDb().insert(ingredient).values(body)
  })
)
