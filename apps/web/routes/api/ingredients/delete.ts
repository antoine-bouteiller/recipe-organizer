import { deleteIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

import { ingredient } from '#server/db/schema'
import { withAuthGuard } from '#server/lib/auth/auth-guard'
import { getDb } from '#server/lib/db'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: deleteIngredientSchema })(async (_context, { body }) => {
    await getDb().delete(ingredient).where(eq(ingredient.id, body.id))
  }),
  'admin'
)
