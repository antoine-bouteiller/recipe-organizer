import { ingredient } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { ingredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { defineHandler } from 'void'

export const GET = defineHandler(() => getDb().query.ingredient.findMany({ orderBy: { name: 'asc' } }))

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: ingredientSchema })(async (_context, { body }) => {
    await getDb().insert(ingredient).values(body)
  })
)
