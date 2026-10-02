import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { deleteFile, uploadFile, uploadVideo } from '@recipe-organizer/server/lib/r2'
import { readRecipeFormData } from '@recipe-organizer/server/recipe/recipe-form-data'
import { assertSubrecipeGroups, deleteRecipeSteps, flattenSteps } from '@recipe-organizer/server/recipe/recipe-steps'
import { resolveAutoFlags, writeRecipeIngredientGraph } from '@recipe-organizer/server/recipe/recipe-write'
import { assertOwnerOrAdmin } from '@recipe-organizer/server/utils/assert-owner-or-admin'
import { updateRecipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import { eq, inArray } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { defineHandler } from 'void'
import type * as z from 'zod'

const resolveImageKey = async (
  image: z.infer<typeof updateRecipeSchema>['image'],
  currentKey: string | null
): Promise<{ key: string; staleKey: string | null }> => {
  if (image instanceof File) {
    return { key: await uploadFile(image), staleKey: currentKey }
  }
  return { key: currentKey ?? '', staleKey: null }
}

const resolveVideoKey = async (
  video: z.infer<typeof updateRecipeSchema>['video'],
  currentKey: string | null | undefined
): Promise<{ key: string | null | undefined; staleKey: string | null }> => {
  if (video instanceof File) {
    return { key: await uploadVideo(video), staleKey: currentKey ?? null }
  }
  if (video === undefined) {
    return { key: currentKey, staleKey: null }
  }
  return { key: video?.id, staleKey: null }
}

// Multipart body: Void's body validator only reads JSON.
export const POST = withAuthGuard(
  defineHandler(async (context) => {
    const data = updateRecipeSchema.parse(await readRecipeFormData(context))
    const { cuisineTypes, id, image, ingredientGroups, linkedRecipes, meals, name, servings, stepGroups, video } = data
    const db = getDb()
    const linkedRecipeIds = linkedRecipes?.map((linkedRecipe) => linkedRecipe.id) ?? []
    assertSubrecipeGroups(stepGroups, linkedRecipeIds, id)
    const currentRecipe = await db.query.recipe.findFirst({ where: { id }, with: { ingredientGroups: { columns: { id: true } } } })
    if (!currentRecipe) {
      throw new HTTPException(404)
    }
    assertOwnerOrAdmin(context.get('apiUser'), currentRecipe)
    const { key: imageKey, staleKey: imageStale } = await resolveImageKey(image, currentRecipe.image)
    const { key: videoKey, staleKey: videoStale } = await resolveVideoKey(video, currentRecipe.video)
    const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((item) => item.id))
    const { isMagimix, isSpice, isVegetarian } = await resolveAutoFlags(db, {
      allIngredientIds,
      linkedRecipeIds,
      meals,
      steps: flattenSteps(stepGroups),
    })
    await db.batch([
      db
        .update(recipe)
        .set({ cuisineTypes, image: imageKey, isMagimix, isSpice, isVegetarian, meals, name, servings, video: videoKey })
        .where(eq(recipe.id, id))
        .returning({ id: recipe.id }),
      db.delete(groupIngredient).where(
        inArray(
          groupIngredient.groupId,
          currentRecipe.ingredientGroups.map(({ id: groupId }) => groupId)
        )
      ),
      db.delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
      db.delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
      deleteRecipeSteps(db, id),
    ])
    await writeRecipeIngredientGraph(db, currentRecipe.id, ingredientGroups, linkedRecipes, stepGroups)
    await Promise.allSettled([imageStale, videoStale].filter((key): key is string => Boolean(key)).map((key) => deleteFile(key)))
    return id
  })
)
