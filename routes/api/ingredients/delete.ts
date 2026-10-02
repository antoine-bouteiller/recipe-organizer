import { ingredient } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { deleteIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: deleteIngredientSchema })(async (_context, { body }) => {
    await getDb().delete(ingredient).where(eq(ingredient.id, body.id))
  }),
  'admin'
)
