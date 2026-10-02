import { defineHandler } from 'void'

import { getDb } from '#server/lib/db'
import { jsonNullable } from '#server/lib/json-nullable'
import { recipeIdParamsSchema } from '#server/recipe/recipe-id-params'
import { selectDefaultSteps } from '#server/recipe/recipe-steps'

export const GET = defineHandler.withValidator({ params: recipeIdParamsSchema })(async (_context, { params }) => {
  const { id } = params
  const db = getDb()
  const result = await db.query.recipe.findFirst({ columns: { id: true, name: true }, where: { id } })
  return jsonNullable(result && { ...result, steps: await selectDefaultSteps(db, id) })
})
