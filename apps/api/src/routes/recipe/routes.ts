import { zValidator } from '@hono/zod-validator'
import { type ApiEnvironment } from '@recipe-organizer/api/api-context'
import { authGuard } from '@recipe-organizer/api/lib/auth/auth-guard'
import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@recipe-organizer/api/schema'
import { assertOwnerOrAdmin } from '@recipe-organizer/api/utils/assert-owner-or-admin'
import {
  deleteRecipeSchema,
  recipeFormWireSchema,
  recipeSchema,
  updateRecipeFormWireSchema,
  updateRecipeSchema,
} from '@recipe-organizer/shared/recipe/schemas'
import { parseFormData } from '@recipe-organizer/shared/utils/form-data'
import { getImageUrl } from '@recipe-organizer/shared/utils/get-file-url'
import { eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import * as z from 'zod'

import { ingredientGroupSelect } from './utils/ingredient-group-select'
import { resolveAutoFlags, writeRecipeIngredientGraph } from './utils/recipe-write'

const idParamSchema = z.object({ id: z.coerce.number() })

const resolveImageKey = async (
  media: ApiEnvironment['Bindings']['media'],
  image: z.infer<typeof updateRecipeSchema>['image'],
  currentKey: string | null
): Promise<{ key: string; staleKey: string | null }> => {
  if (image instanceof File) {
    return { key: await media.uploadFile(image), staleKey: currentKey }
  }
  return { key: currentKey ?? '', staleKey: null }
}

const resolveVideoKey = async (
  media: ApiEnvironment['Bindings']['media'],
  video: z.infer<typeof updateRecipeSchema>['video'],
  currentKey: string | null | undefined
): Promise<{ key: string | null | undefined; staleKey: string | null }> => {
  if (video instanceof File) {
    return { key: await media.uploadVideo(video), staleKey: currentKey ?? null }
  }
  if (video === undefined) {
    return { key: currentKey, staleKey: null }
  }
  return { key: video?.id, staleKey: null }
}

export const recipeRoutes = new Hono<ApiEnvironment>()
  .get('/', async (context) => {
    const rows = await context.env.db.query.recipe.findMany({
      columns: {
        cuisineTypes: true,
        id: true,
        image: true,
        isMagimix: true,
        isSpice: true,
        isVegetarian: true,
        meals: true,
        name: true,
        servings: true,
      },
      orderBy: { name: 'asc' },
    })
    return context.json(
      rows.map((row) => ({
        cuisineTypes: row.cuisineTypes ?? [],
        id: row.id,
        image: getImageUrl(row.image),
        isMagimix: row.isMagimix,
        isSpice: row.isSpice,
        isVegetarian: row.isVegetarian,
        meals: row.meals ?? [],
        name: row.name,
        servings: row.servings,
      }))
    )
  })
  .get('/:id', zValidator('param', idParamSchema), async (context) => {
    const { id } = context.req.valid('param')
    const result = await context.env.db.query.recipe.findFirst({
      where: { id },
      with: {
        ingredientGroups: { orderBy: { isDefault: 'desc' }, ...ingredientGroupSelect },
        linkedRecipes: {
          with: {
            linkedRecipe: { columns: { id: true, name: true }, with: { ingredientGroups: { ...ingredientGroupSelect, where: { isDefault: true } } } },
          },
        },
      },
    })
    if (!result) {
      throw new HTTPException(404)
    }
    return context.json({
      cuisineTypes: result.cuisineTypes,
      id: result.id,
      image: getImageUrl(result.image),
      ingredientGroups: result.ingredientGroups,
      instructions: result.instructions,
      isMagimix: result.isMagimix,
      isVegetarian: result.isVegetarian,
      linkedRecipes: result.linkedRecipes,
      meals: result.meals,
      name: result.name,
      servings: result.servings,
      video: result.video,
    })
  })
  .get('/:id/instructions', zValidator('param', idParamSchema), async (context) => {
    const { id } = context.req.valid('param')
    const result = await context.env.db.query.recipe.findFirst({ columns: { id: true, instructions: true, name: true }, where: { id } })
    return context.json(result ?? null)
  })
  .post('/', authGuard(), zValidator('form', recipeFormWireSchema), async (context) => {
    const data = recipeSchema.parse(parseFormData(await context.req.formData()))
    const { cuisineTypes, image, ingredientGroups, instructions, linkedRecipes, meals, name, servings, video } = data
    const { db } = context.env
    const imageKey = image instanceof File ? await context.env.media.uploadFile(image) : image.id
    const videoKey = video instanceof File ? await context.env.media.uploadVideo(video) : video?.id
    const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((item) => item.id))
    const linkedRecipeIds = linkedRecipes?.map((linkedRecipe) => linkedRecipe.id) ?? []
    const { isMagimix, isSpice, isVegetarian } = await resolveAutoFlags(db, { allIngredientIds, instructions, linkedRecipeIds, meals })
    const [createdRecipe] = await db
      .insert(recipe)
      .values({
        createdBy: context.get('user').id,
        cuisineTypes,
        image: imageKey,
        instructions,
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
      await writeRecipeIngredientGraph(db, createdRecipe.id, ingredientGroups, linkedRecipes)
    } catch (error) {
      await db.delete(recipe).where(eq(recipe.id, createdRecipe.id))
      throw error
    }
    return context.body(null, 204)
  })
  .post('/update', authGuard(), zValidator('form', updateRecipeFormWireSchema), async (context) => {
    const data = updateRecipeSchema.parse(parseFormData(await context.req.formData()))
    const { cuisineTypes, id, image, ingredientGroups, instructions, linkedRecipes, meals, name, servings, video } = data
    const { db } = context.env
    const currentRecipe = await db.query.recipe.findFirst({ where: { id }, with: { ingredientGroups: { columns: { id: true } } } })
    if (!currentRecipe) {
      throw new HTTPException(404)
    }
    assertOwnerOrAdmin(context.get('user'), currentRecipe)
    const { key: imageKey, staleKey: imageStale } = await resolveImageKey(context.env.media, image, currentRecipe.image)
    const { key: videoKey, staleKey: videoStale } = await resolveVideoKey(context.env.media, video, currentRecipe.video)
    const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((item) => item.id))
    const linkedRecipeIds = linkedRecipes?.map((linkedRecipe) => linkedRecipe.id) ?? []
    const { isMagimix, isSpice, isVegetarian } = await resolveAutoFlags(db, { allIngredientIds, instructions, linkedRecipeIds, meals })
    await db.batch([
      db
        .update(recipe)
        .set({ cuisineTypes, image: imageKey, instructions, isMagimix, isSpice, isVegetarian, meals, name, servings, video: videoKey })
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
    ])
    await writeRecipeIngredientGraph(db, currentRecipe.id, ingredientGroups, linkedRecipes)
    await Promise.allSettled([imageStale, videoStale].filter((key): key is string => Boolean(key)).map((key) => context.env.media.deleteFile(key)))
    return context.json(id)
  })
  .post('/delete', authGuard(), zValidator('json', deleteRecipeSchema), async (context) => {
    const id = context.req.valid('json')
    const { db } = context.env
    const currentRecipe = await db.query.recipe.findFirst({
      columns: { createdBy: true, id: true, image: true },
      where: { id },
      with: { ingredientGroups: { columns: { id: true } } },
    })
    if (!currentRecipe) {
      throw new Error('Recipe not found')
    }
    assertOwnerOrAdmin(context.get('user'), currentRecipe)
    await db.batch([
      db.delete(groupIngredient).where(
        inArray(
          groupIngredient.groupId,
          currentRecipe.ingredientGroups.map(({ id: groupId }) => groupId)
        )
      ),
      db.delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
      db.delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
      db.delete(recipe).where(eq(recipe.id, id)),
    ])
    await context.env.media.deleteFile(currentRecipe.image)
    return context.body(null, 204)
  })
