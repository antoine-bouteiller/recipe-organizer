import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { listIngredients } from '@/features/ingredients/server/queries'
import { updateRecipeSchema } from '@/features/recipe/schemas'
import { getRecipeDetails, listRecipes } from '@/features/recipe/server/queries'
import { readRecipeFormData, validateRecipeForm } from '@/features/recipe/server/recipe-form-data'
import { recipeIdParamsSchema } from '@/features/recipe/server/recipe-id-params'
import { updateRecipe } from '@/features/recipe/server/recipe-mutations'
import { guardPage } from '@/lib/server/auth/page-guard'
import { getDb } from '@/lib/server/db'
import { HttpError } from '@/lib/server/http-error'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  const user = await guardPage(context)
  if (user instanceof Response) {
    return user
  }
  const params = recipeIdParamsSchema.safeParse(context.req.param())
  const db = getDb()
  const [recipe, ingredients, recipes] = await Promise.all([
    params.success ? getRecipeDetails(db, params.data.id) : undefined,
    listIngredients(db),
    listRecipes(db),
  ])
  return { ingredients, recipe: recipe ?? null, recipes }
})

// Expose the draft body to Void codegen without its JSON-only withValidator parser.
// Runtime validation remains strict after the transport-aware reader.
export const action = Object.assign(
  defineHandler(async (context) => {
    const user = await guardPage(context)
    if (user instanceof Response) {
      return user
    }
    const { id } = recipeIdParamsSchema.parse(context.req.param())
    const data = validateRecipeForm(updateRecipeSchema, await readRecipeFormData(context))
    if (data.id !== id) {
      throw new HttpError(400, 'Recipe id does not match the page')
    }
    await updateRecipe(getDb(), user, data)
    return undefined
  }),
  { __validators: { body: updateRecipeSchema.partial() } }
)
