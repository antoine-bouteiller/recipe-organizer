import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

const getRecipe = createServerFn({
  method: 'GET',
})
  .inputValidator(z.number())
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const result = await getDb().query.recipe.findFirst({
        where: eq(recipe.id, data),
        with: {
          sections: {
            with: {
              sectionIngredients: {
                with: {
                  ingredient: true,
                  unit: true,
                },
              },
              subRecipe: {
                with: {
                  sections: {
                    with: {
                      sectionIngredients: {
                        with: {
                          ingredient: true,
                          unit: true,
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: (table) => [desc(table.isDefault)],
          },
        },
      })

      if (!result) {
        throw notFound()
      }

      return {
        ...result,
        image: result.image,
      }
    })
  )

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeSection = Recipe['sections'][number]

const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.recipeDetail(id),
    queryFn: () => getRecipe({ data: id }),
  })

export { getRecipe, getRecipeDetailsOptions }
