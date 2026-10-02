import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { getRecipeDetails, getSubrecipeInstructions } from '@/features/recipe/server/queries'
import { deleteRecipe } from '@/features/recipe/server/recipe-delete'
import { recipeIdParamsSchema } from '@/features/recipe/server/recipe-id-params'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async (context) => {
  const params = recipeIdParamsSchema.safeParse({ id: context.req.param('id') })
  const db = getDb()
  const recipe = params.success ? await getRecipeDetails(db, params.data.id) : undefined
  if (!recipe) {
    return { recipe: null, subrecipes: [] }
  }
  const subrecipeIds = recipe.stepGroups.flatMap((group) => (group.kind === 'subrecipe' ? [group.recipeId] : []))
  return { recipe, subrecipes: await getSubrecipeInstructions(db, subrecipeIds) }
})

export const action = withAuthGuard(
  defineHandler.withValidator({ params: recipeIdParamsSchema })(async (context, { params }) => {
    await deleteRecipe(getDb(), context.get('apiUser'), params.id)
    return context.redirect('/')
  })
)
