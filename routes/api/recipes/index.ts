import { defineHandler } from 'void'

import { recipeSchema } from '@/features/recipe/schemas'
import { listRecipes } from '@/features/recipe/server/queries'
import { readRecipeFormData, validateRecipeForm } from '@/features/recipe/server/recipe-form-data'
import { createRecipe } from '@/features/recipe/server/recipe-mutations'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'

export const GET = defineHandler(() => listRecipes(getDb()))

// Expose the draft body to Void codegen without its JSON-only withValidator parser.
// Runtime validation remains strict after the transport-aware reader.
export const POST = Object.assign(
  withAuthGuard(
    defineHandler(async (context) => {
      const data = validateRecipeForm(recipeSchema, await readRecipeFormData(context))
      return { id: await createRecipe(getDb(), context.get('apiUser'), data) }
    })
  ),
  { __validators: { body: recipeSchema.partial() } }
)
