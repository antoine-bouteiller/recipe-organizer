import { ingredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { defineHandler } from 'void'

import { ingredient } from '#server/db/schema'
import { withAuthGuard } from '#server/lib/auth/auth-guard'
import { getDb } from '#server/lib/db'

export const GET = defineHandler(() => getDb().query.ingredient.findMany({ orderBy: { name: 'asc' } }))

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: ingredientSchema })(async (_context, { body }) => {
    await getDb().insert(ingredient).values(body)
  })
)
