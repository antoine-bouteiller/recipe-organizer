import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { groupIngredient, recipe, recipeIngredientGroup } from '@/lib/db/schema'
import { ingredient } from '@/lib/db/schema/ingredient'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { getFileUrl } from '@/utils/get-file-url'

import { embeddedRecipe, embeddedRecipeGroupIngredient, embeddedRecipeIngredient, embeddedRecipeIngredientGroup } from '../utils/drizzle-alias'

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
          isMagimix: sql<boolean>`${recipe.instructions} LIKE '%data-type="magimix-program"%'`.mapWith(Boolean),
          isVegetarian:
            sql<boolean>`COUNT(CASE WHEN ${ingredient.category} = 'meat' OR ${ingredient.category} = 'fish' OR ${embeddedRecipeIngredient.category} = 'meat' OR ${embeddedRecipeIngredient.category} = 'fish' THEN 1 END) = 0`.mapWith(
              Boolean
            ),
          name: recipe.name,
          servings: recipe.servings,
        })
        .from(recipe)
        .leftJoin(recipeIngredientGroup, eq(recipeIngredientGroup.recipeId, recipe.id))
        .leftJoin(groupIngredient, eq(groupIngredient.groupId, recipeIngredientGroup.id))
        .leftJoin(ingredient, eq(ingredient.id, groupIngredient.ingredientId))
        .leftJoin(embeddedRecipe, eq(recipeIngredientGroup.embeddedRecipeId, embeddedRecipe.id))
        .leftJoin(embeddedRecipeIngredientGroup, eq(embeddedRecipeIngredientGroup.recipeId, embeddedRecipe.id))
        .leftJoin(embeddedRecipeGroupIngredient, eq(embeddedRecipeGroupIngredient.groupId, embeddedRecipeIngredientGroup.id))
        .leftJoin(embeddedRecipeIngredient, eq(embeddedRecipeIngredient.id, embeddedRecipeGroupIngredient.ingredientId))
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
