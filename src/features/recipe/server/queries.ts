import { ingredientGroupSelect } from '@/features/recipe/server/ingredient-group-select'
import { selectDefaultSteps, selectRecipeStepGroups } from '@/features/recipe/server/recipe-steps'
import type { getDb } from '@/lib/server/db'
import { getImageUrl } from '@/utils/get-file-url'

type Db = ReturnType<typeof getDb>

export const listRecipes = async (db: Db) => {
  const rows = await db.query.recipe.findMany({
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
}

export const getRecipeDetails = async (db: Db, id: number) => {
  const result = await db.query.recipe.findFirst({
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
    return undefined
  }
  const stepGroups = await selectRecipeStepGroups(db, id)
  return {
    cuisineTypes: result.cuisineTypes,
    id: result.id,
    image: getImageUrl(result.image),
    ingredientGroups: result.ingredientGroups,
    isMagimix: result.isMagimix,
    isVegetarian: result.isVegetarian,
    linkedRecipes: result.linkedRecipes,
    meals: result.meals,
    name: result.name,
    servings: result.servings,
    stepGroups,
    video: result.video,
  }
}

/** Default steps of the sub-recipes a recipe embeds, keyed by recipe id. */
export const getSubrecipeInstructions = async (db: Db, recipeIds: readonly number[]) =>
  Promise.all(
    recipeIds.map(async (id) => {
      const result = await db.query.recipe.findFirst({ columns: { id: true, name: true }, where: { id } })
      return result && { ...result, steps: await selectDefaultSteps(db, id) }
    })
  ).then((sources) => sources.filter((source) => source !== undefined))
