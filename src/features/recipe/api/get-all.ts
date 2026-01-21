import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'
import { getFileUrl } from '@/utils/get-file-url'

const getAllRecipesSchema = type({
  'search?': 'string | undefined',
})

const getAllRecipes = createServerFn({
  method: 'GET',
})
  .inputValidator(getAllRecipesSchema)
  .handler(
    withServerError(async ({ data }) => {
      const rows = await getDb().query.recipe.findMany({
        orderBy: {
          name: 'asc',
        },
        columns: {
          id: true,
          name: true,
          image: true,
          servings: true,
        },
        extras: {
          isMagimix: (recipe, { sql }) => sql<boolean>`${recipe.instructions} LIKE '%data-type="magimix-program"%'`.mapWith(Boolean),
        },
        where: {
          name: {
            like: data.search ? `%${data.search}%` : undefined,
          },
        },
        with: {
          ingredientGroups: {
            with: {
              groupIngredients: {
                with: {
                  ingredient: true,
                },
              },
            },
          },
        },
      })

      return rows.map((row) => {
        const ingredients = row.ingredientGroups.flatMap((group) => group.groupIngredients.map((gi) => gi.ingredient))

        return {
          id: row.id,
          image: getFileUrl(row.image),
          isMagimix: row.isMagimix,
          isVegetarian: ingredients.every((ingredient) => ingredient.category !== 'meat' && ingredient.category !== 'fish'),
          name: row.name,
          servings: row.servings,
        }
      })
    })
  )

const getRecipeListOptions = (search?: string) =>
  queryOptions({
    queryFn: () => getAllRecipes({ data: { search } }),
    queryKey: queryKeys.recipeList(search),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]

export { getAllRecipes, getRecipeListOptions }
