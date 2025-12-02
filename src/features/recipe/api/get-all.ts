import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { ingredient } from '@/lib/db/schema/ingredient'
import { recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema/recipe-ingredients'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { getFileUrl } from '@/utils/get-file-url'

import { subRecipe, subRecipeIngredient, subRecipeIngredientsSection, subRecipeSectionIngredient } from '../utils/drizlle-alias'

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
          image: sql`${recipe.image}`.mapWith(getFileUrl),
          isMagimix: sql<boolean>`${recipe.steps} LIKE '%data-type="magimix-program"%'`.mapWith(Boolean),
          isVegetarian:
            sql<boolean>`COUNT(CASE WHEN ${ingredient.category} = 'meat' OR ${ingredient.category} = 'fish' OR ${subRecipeIngredient.category} = 'meat' OR ${subRecipeIngredient.category} = 'fish' THEN 1 END) = 0`.mapWith(
              Boolean
            ),
          name: recipe.name,
          quantity: recipe.quantity,
        })
        .from(recipe)
        .leftJoin(recipeIngredientsSection, eq(recipeIngredientsSection.recipeId, recipe.id))
        .leftJoin(sectionIngredient, eq(sectionIngredient.sectionId, recipeIngredientsSection.id))
        .leftJoin(ingredient, eq(ingredient.id, sectionIngredient.ingredientId))
        .leftJoin(subRecipe, eq(recipeIngredientsSection.subRecipeId, subRecipe.id))
        .leftJoin(subRecipeIngredientsSection, eq(subRecipeIngredientsSection.recipeId, subRecipe.id))
        .leftJoin(subRecipeSectionIngredient, eq(subRecipeSectionIngredient.sectionId, subRecipeIngredientsSection.id))
        .leftJoin(subRecipeIngredient, eq(subRecipeIngredient.id, subRecipeSectionIngredient.ingredientId))
        .where(data.search ? like(recipe.name, `%${data.search}%`) : undefined)
        .groupBy(recipe.id)
        .orderBy(asc(recipe.name))
    )
  )

const getRecipeListOptions = (search?: string) =>
  queryOptions({
    queryFn: () => getAllRecipes({ data: { search } }),
    queryKey: queryKeys.recipeList(search),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]

export { getAllRecipes, getRecipeListOptions }
