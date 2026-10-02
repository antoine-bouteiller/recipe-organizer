import { getDb } from '@recipe-organizer/server/lib/db'
import { jsonNullable } from '@recipe-organizer/server/lib/json-nullable'
import { recipeIdParamsSchema } from '@recipe-organizer/server/recipe/recipe-id-params'
import { selectDefaultSteps } from '@recipe-organizer/server/recipe/recipe-steps'
import { defineHandler } from 'void'

export const GET = defineHandler.withValidator({ params: recipeIdParamsSchema })(async (_context, { params }) => {
  const { id } = params
  const db = getDb()
  const result = await db.query.recipe.findFirst({ columns: { id: true, name: true }, where: { id } })
  return jsonNullable(result && { ...result, steps: await selectDefaultSteps(db, id) })
})
