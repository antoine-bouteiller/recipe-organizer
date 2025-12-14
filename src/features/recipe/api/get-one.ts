import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'

const getRecipe = createServerFn({
  method: 'GET',
})
  .inputValidator(z.number())
  .handler(
    withServerErrorCapture(async ({ data }) => {
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
