import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { listIngredients } from '@/features/ingredients/server/queries'
import { recipeSchema } from '@/features/recipe/schemas'
import { listRecipes } from '@/features/recipe/server/queries'
import { readRecipeFormData, validateRecipeForm } from '@/features/recipe/server/recipe-form-data'
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

// Expose the draft body to Void codegen without its JSON-only withValidator parser.
// Runtime validation remains strict after the transport-aware reader.
export const action = Object.assign(
  defineHandler(async (context) => {
    const user = await guardPage(context)
    if (user instanceof Response) {
      return user
    }
    const data = validateRecipeForm(recipeSchema, await readRecipeFormData(context))
    await createRecipe(getDb(), user, data)
    return undefined
  }),
  { __validators: { body: recipeSchema.partial() } }
)
