import { listIngredients } from '@recipe-organizer/server/ingredients/queries'
import { guardPage } from '@recipe-organizer/server/lib/auth/page-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { getRecipeDetails, listRecipes } from '@recipe-organizer/server/recipe/queries'
import { readRecipeFormData } from '@recipe-organizer/server/recipe/recipe-form-data'
import { recipeIdParamsSchema } from '@recipe-organizer/server/recipe/recipe-id-params'
import { updateRecipe } from '@recipe-organizer/server/recipe/recipe-mutations'
import { updateRecipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import { HTTPException } from 'hono/http-exception'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

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

export const action = defineHandler(async (context) => {
  const user = await guardPage(context)
  if (user instanceof Response) {
    return user
  }
  const { id } = recipeIdParamsSchema.parse(context.req.param())
  const data = updateRecipeSchema.parse(await readRecipeFormData(context))
  if (data.id !== id) {
    throw new HTTPException(400, { message: 'Recipe id does not match the page' })
  }
  await updateRecipe(getDb(), user, data)
  return undefined
})
