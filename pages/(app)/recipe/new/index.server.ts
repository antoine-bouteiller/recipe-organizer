import { listIngredients } from '@recipe-organizer/server/ingredients/queries'
import { guardPage } from '@recipe-organizer/server/lib/auth/page-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { listRecipes } from '@recipe-organizer/server/recipe/queries'
import { readRecipeFormData } from '@recipe-organizer/server/recipe/recipe-form-data'
import { createRecipe } from '@recipe-organizer/server/recipe/recipe-mutations'
import { recipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  const user = await guardPage(context)
  if (user instanceof Response) {
    return user
  }
  const db = getDb()
  const [ingredients, recipes] = await Promise.all([listIngredients(db), listRecipes(db)])
  return { ingredients, recipes }
})

export const action = defineHandler(async (context) => {
  const user = await guardPage(context)
  if (user instanceof Response) {
    return user
  }
  const data = recipeSchema.parse(await readRecipeFormData(context))
  await createRecipe(getDb(), user, data)
  return undefined
})
