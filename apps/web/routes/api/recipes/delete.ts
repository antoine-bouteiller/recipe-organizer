import { deleteRecipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import { eq, inArray } from 'drizzle-orm'
import { defineHandler } from 'void'

import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '#server/db/schema'
import { withAuthGuard } from '#server/lib/auth/auth-guard'
import { getDb } from '#server/lib/db'
import { deleteFile } from '#server/lib/r2'
import { deleteRecipeSteps } from '#server/recipe/recipe-steps'
import { assertOwnerOrAdmin } from '#server/utils/assert-owner-or-admin'

export const POST = withAuthGuard(
  defineHandler.withValidator({ body: deleteRecipeSchema })(async (context, { body: id }) => {
    const db = getDb()
    const currentRecipe = await db.query.recipe.findFirst({
      columns: { createdBy: true, id: true, image: true },
      where: { id },
      with: { ingredientGroups: { columns: { id: true } } },
    })
    if (!currentRecipe) {
      throw new Error('Recipe not found')
    }
    assertOwnerOrAdmin(context.get('apiUser'), currentRecipe)
    await db.batch([
      db.delete(groupIngredient).where(
        inArray(
          groupIngredient.groupId,
          currentRecipe.ingredientGroups.map(({ id: groupId }) => groupId)
        )
      ),
      db.delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
      db.delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
      deleteRecipeSteps(db, id),
      db.delete(recipe).where(eq(recipe.id, id)),
    ])
    await deleteFile(currentRecipe.image)
  })
)
