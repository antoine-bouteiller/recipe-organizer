import { getDb } from '@recipe-organizer/server/lib/db'
import { ingredientGroupSelect } from '@recipe-organizer/server/recipe/ingredient-group-select'
import { recipeIdParamsSchema } from '@recipe-organizer/server/recipe/recipe-id-params'
import { selectRecipeStepGroups } from '@recipe-organizer/server/recipe/recipe-steps'
import { getImageUrl } from '@recipe-organizer/shared/utils/get-file-url'
import { HTTPException } from 'hono/http-exception'
import { defineHandler } from 'void'

export const GET = defineHandler.withValidator({ params: recipeIdParamsSchema })(async (_context, { params }) => {
  const { id } = params
  const db = getDb()
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
    throw new HTTPException(404)
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
})
