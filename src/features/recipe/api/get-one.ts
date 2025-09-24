import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { withServerErrorCapture } from '@/lib/error-handler'
import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

const getRecipe = createServerFn({
  method: 'GET',
  response: 'data',
})
  .validator(z.number())
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
                },
              },
              subRecipe: {
                with: {
                  sections: {
                    with: {
                      sectionIngredients: {
                        with: {
                          ingredient: true,
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

const getRecipeQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ['recipes', id.toString()],
    queryFn: () => getRecipe({ data: typeof id === 'string' ? Number.parseInt(id) : id }),
  })

export { getRecipe, getRecipeQueryOptions }
