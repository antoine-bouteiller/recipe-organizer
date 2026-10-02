import { HTTPException } from 'hono/http-exception'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { listIngredients } from '@/features/ingredients/server/queries'
import { updateRecipeSchema } from '@/features/recipe/schemas'
import { getRecipeDetails, listRecipes } from '@/features/recipe/server/queries'
import { readRecipeFormData } from '@/features/recipe/server/recipe-form-data'
import { recipeIdParamsSchema } from '@/features/recipe/server/recipe-id-params'
import { updateRecipe } from '@/features/recipe/server/recipe-mutations'
import { guardPage } from '@/lib/server/auth/page-guard'
import { getDb } from '@/lib/server/db'

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
