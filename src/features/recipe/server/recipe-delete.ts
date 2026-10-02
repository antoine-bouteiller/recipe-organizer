import { eq, inArray } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/db/schema'
import { deleteRecipeSteps } from '@/features/recipe/server/recipe-steps'
import { assertOwnerOrAdmin } from '@/lib/server/assert-owner-or-admin'
import type { ApiUser } from '@/lib/server/auth/api-user'
import type { getDb } from '@/lib/server/db'
import { deleteFile } from '@/lib/server/r2'

export const deleteRecipe = async (db: ReturnType<typeof getDb>, user: ApiUser, id: number) => {
  const currentRecipe = await db.query.recipe.findFirst({
    columns: { createdBy: true, id: true, image: true },
    where: { id },
    with: { ingredientGroups: { columns: { id: true } } },
  })
  if (!currentRecipe) {
    throw new HTTPException(404, { message: 'Recipe not found' })
  }
  assertOwnerOrAdmin(user, currentRecipe)
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
}
