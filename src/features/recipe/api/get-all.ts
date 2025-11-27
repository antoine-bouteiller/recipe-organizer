import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { ingredient } from '@/lib/db/schema/ingredient'
import { recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema/recipe-ingredients'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { getFileUrl } from '@/utils/get-file-url'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'

const getAllRecipesSchema = z.object({
  search: z.string().optional(),
})

const getAllRecipes = createServerFn({
  method: 'GET',
})
  .inputValidator(getAllRecipesSchema)
  .handler(
    withServerErrorCapture(async ({ data }) =>
      getDb()
        .select({
          id: recipe.id,
          name: recipe.name,
          image: sql`${recipe.image}`.mapWith(getFileUrl),
          quantity: recipe.quantity,
          isVegetarian:
            sql<boolean>`COUNT(CASE WHEN ${ingredient.category} = 'meat' THEN 1 END) = 0`.mapWith(
              Boolean
            ),
          isMagimix: sql<boolean>`${recipe.steps} LIKE '%data-type="magimix-program"%'`.mapWith(
            Boolean
          ),
        })
        .from(recipe)
        .leftJoin(recipeIngredientsSection, eq(recipeIngredientsSection.recipeId, recipe.id))
        .leftJoin(sectionIngredient, eq(sectionIngredient.sectionId, recipeIngredientsSection.id))
        .leftJoin(ingredient, eq(ingredient.id, sectionIngredient.ingredientId))
        .where(data.search ? like(recipe.name, `%${data.search}%`) : undefined)
        .groupBy(recipe.id)
        .orderBy(asc(recipe.name))
    )
  )

const getRecipeListOptions = (search?: string) =>
  queryOptions({
    queryKey: queryKeys.recipeList(search),
    queryFn: () => getAllRecipes({ data: { search } }),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]

export { getAllRecipes, getRecipeListOptions }
