import { defineHandler } from 'void'

import { updateRecipeSchema } from '@/features/recipe/schemas'
import { getRecipeDetails, getSubrecipeInstructions } from '@/features/recipe/server/queries'
import { deleteRecipe } from '@/features/recipe/server/recipe-delete'
import { readRecipeFormData, validateRecipeForm } from '@/features/recipe/server/recipe-form-data'
import { recipeIdParamsSchema } from '@/features/recipe/server/recipe-id-params'
import { updateRecipe } from '@/features/recipe/server/recipe-mutations'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'
import { HttpError } from '@/lib/server/http-error'

export const GET = defineHandler.withValidator({ params: recipeIdParamsSchema })(async (_context, { params }) => {
  const db = getDb()
  const recipe = await getRecipeDetails(db, params.id)
  if (!recipe) {
    throw new HttpError(404, 'not_found')
  }
  const subrecipeIds = recipe.stepGroups.flatMap((group) => (group.kind === 'subrecipe' ? [group.recipeId] : []))
  return { recipe, subrecipes: await getSubrecipeInstructions(db, subrecipeIds) }
})

// Expose the draft body to Void codegen without its JSON-only withValidator parser.
// Runtime validation remains strict after the transport-aware reader.
export const PUT = Object.assign(
  withAuthGuard(
    defineHandler(async (context) => {
      const { id } = recipeIdParamsSchema.parse(context.req.param())
      const data = validateRecipeForm(updateRecipeSchema, await readRecipeFormData(context))
      if (data.id !== id) {
        throw new HttpError(400, 'Recipe id does not match the path')
      }
      return { id: await updateRecipe(getDb(), context.get('apiUser'), data) }
    })
  ),
  { __validators: { body: updateRecipeSchema.partial(), params: recipeIdParamsSchema } }
)

export const DELETE = withAuthGuard(
  defineHandler.withValidator({ params: recipeIdParamsSchema })(async (context, { params }) => {
    await deleteRecipe(getDb(), context.get('apiUser'), params.id)
  })
)
