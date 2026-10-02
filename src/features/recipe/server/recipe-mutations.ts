import { eq, inArray } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type * as z from 'zod'

import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/db/schema'
import type { recipeSchema, updateRecipeSchema } from '@/features/recipe/schemas'
import { assertSubrecipeGroups, deleteRecipeSteps, flattenSteps } from '@/features/recipe/server/recipe-steps'
import { resolveAutoFlags, writeRecipeIngredientGraph } from '@/features/recipe/server/recipe-write'
import { assertOwnerOrAdmin } from '@/lib/server/assert-owner-or-admin'
import type { ApiUser } from '@/lib/server/auth/api-user'
import type { getDb } from '@/lib/server/db'
import { deleteFile, uploadFile, uploadVideo } from '@/lib/server/r2'

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

export const createRecipe = async (db: ReturnType<typeof getDb>, user: ApiUser, data: z.infer<typeof recipeSchema>) => {
  const { cuisineTypes, image, ingredientGroups, linkedRecipes, meals, name, servings, stepGroups, video } = data
  const linkedRecipeIds = linkedRecipes?.map((linkedRecipe) => linkedRecipe.id) ?? []
  assertSubrecipeGroups(stepGroups, linkedRecipeIds)
  const imageKey = image instanceof File ? await uploadFile(image) : image.id
  const videoKey = video instanceof File ? await uploadVideo(video) : video?.id
  const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((item) => item.id))
  const { isMagimix, isSpice, isVegetarian } = await resolveAutoFlags(db, {
    allIngredientIds,
    linkedRecipeIds,
    meals,
    steps: flattenSteps(stepGroups),
  })
  const [createdRecipe] = await db
    .insert(recipe)
    .values({
      createdBy: user.id,
      cuisineTypes,
      image: imageKey,
      isMagimix,
      isSpice,
      isVegetarian,
      meals,
      name,
      servings,
      video: videoKey,
    })
    .returning({ id: recipe.id })
  try {
    await writeRecipeIngredientGraph(db, createdRecipe.id, ingredientGroups, linkedRecipes, stepGroups)
  } catch (error) {
    await db.delete(recipe).where(eq(recipe.id, createdRecipe.id))
    throw error
  }
}

export const updateRecipe = async (db: ReturnType<typeof getDb>, user: ApiUser, data: z.infer<typeof updateRecipeSchema>) => {
  const { cuisineTypes, id, image, ingredientGroups, linkedRecipes, meals, name, servings, stepGroups, video } = data
  const linkedRecipeIds = linkedRecipes?.map((linkedRecipe) => linkedRecipe.id) ?? []
  assertSubrecipeGroups(stepGroups, linkedRecipeIds, id)
  const currentRecipe = await db.query.recipe.findFirst({ where: { id }, with: { ingredientGroups: { columns: { id: true } } } })
  if (!currentRecipe) {
    throw new HTTPException(404)
  }
  assertOwnerOrAdmin(user, currentRecipe)
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
}
