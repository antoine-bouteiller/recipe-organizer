import { ingredient } from '@recipe-organizer/server/db/schema'
import { listIngredients } from '@recipe-organizer/server/ingredients/queries'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { guardPage } from '@recipe-organizer/server/lib/auth/page-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { deleteIngredientSchema, updateIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  const user = await guardPage(context)
  if (user instanceof Response) {
    return user
  }
  return { ingredients: await listIngredients(getDb()), isAdmin: user.role === 'admin' }
})

export const actions = {
  delete: withAuthGuard(
    defineHandler.withValidator({ body: deleteIngredientSchema })(async (_context, { body }) => {
      await getDb().delete(ingredient).where(eq(ingredient.id, body.id))
    }),
    'admin'
  ),
  update: withAuthGuard(
    defineHandler.withValidator({ body: updateIngredientSchema })(async (_context, { body }) => {
      const { id, ...newIngredient } = body
      await getDb().update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
    })
  ),
}
