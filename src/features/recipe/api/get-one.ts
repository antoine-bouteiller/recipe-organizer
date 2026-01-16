import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'
import { desc, eq } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

const getRecipeSchema = type('number')

const getRecipe = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipeSchema)
  .handler(
    withServerError(async ({ data }) => {
      const result = await getDb().query.recipe.findFirst({
        where: eq(recipe.id, data),
        with: {
          ingredientGroups: {
            orderBy: (table) => [desc(table.isDefault)],
            with: {
              groupIngredients: {
                with: {
                  ingredient: true,
                  unit: true,
                },
              },
            },
          },
          linkedRecipes: {
            with: {
              linkedRecipe: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      if (!result) {
        throw notFound()
      }

      return result
    })
  )

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipe({ data: id }),
    queryKey: queryKeys.recipeDetail(id),
  })

export { getRecipe, getRecipeDetailsOptions }
