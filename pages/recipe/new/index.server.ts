import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { listIngredients } from '@/features/ingredients/server/queries'
import { recipeSchema } from '@/features/recipe/schemas'
import { listRecipes } from '@/features/recipe/server/queries'
import { readRecipeFormData } from '@/features/recipe/server/recipe-form-data'
import { createRecipe } from '@/features/recipe/server/recipe-mutations'
import { guardPage } from '@/lib/server/auth/page-guard'
import { getDb } from '@/lib/server/db'

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
