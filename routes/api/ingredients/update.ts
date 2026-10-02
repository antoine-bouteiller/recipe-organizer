import { ingredient } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { updateIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: updateIngredientSchema })(async (_context, { body }) => {
    const { id, ...newIngredient } = body
    await getDb().update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
  })
)
