import { updateIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

import { ingredient } from '#server/db/schema'
import { withAuthGuard } from '#server/lib/auth/auth-guard'
import { getDb } from '#server/lib/db'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: updateIngredientSchema })(async (_context, { body }) => {
    const { id, ...newIngredient } = body
    await getDb().update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
  })
)
