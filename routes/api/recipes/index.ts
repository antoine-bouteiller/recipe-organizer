import { recipe } from '@recipe-organizer/server/db/schema'
import { withAuthGuard } from '@recipe-organizer/server/lib/auth/auth-guard'
import { getDb } from '@recipe-organizer/server/lib/db'
import { uploadFile, uploadVideo } from '@recipe-organizer/server/lib/r2'
import { readRecipeFormData } from '@recipe-organizer/server/recipe/recipe-form-data'
import { assertSubrecipeGroups, flattenSteps } from '@recipe-organizer/server/recipe/recipe-steps'
import { resolveAutoFlags, writeRecipeIngredientGraph } from '@recipe-organizer/server/recipe/recipe-write'
import { recipeSchema } from '@recipe-organizer/shared/recipe/schemas'
import { getImageUrl } from '@recipe-organizer/shared/utils/get-file-url'
import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'

export const GET = defineHandler(async () => {
  const rows = await getDb().query.recipe.findMany({
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
  return rows.map((row) => ({
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
})

// Multipart body: Void's body validator only reads JSON.
export const POST = withAuthGuard(
  defineHandler(async (context) => {
    const data = recipeSchema.parse(await readRecipeFormData(context))
    const { cuisineTypes, image, ingredientGroups, linkedRecipes, meals, name, servings, stepGroups, video } = data
    const db = getDb()
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
        createdBy: context.get('apiUser').id,
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
  })
)
