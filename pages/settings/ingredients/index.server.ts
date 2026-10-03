import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { ingredient } from '@/db/schema'
import { deleteIngredientSchema, updateIngredientSchema } from '@/features/ingredients/schemas'
import { listIngredients } from '@/features/ingredients/server/queries'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { guardPage } from '@/lib/server/auth/page-guard'
import { getDb } from '@/lib/server/db'

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
