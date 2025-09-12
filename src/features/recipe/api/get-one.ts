import { getDb } from '@/lib/db'
import { withServerErrorCapture } from '@/lib/error-handler'
import { getFileUrl } from '@/lib/r2'
import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const getRecipe = createServerFn({
  method: 'GET',
  response: 'data',
})
  .validator(z.number())
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const result = await getDb().recipe.findFirst({
        where: {
          id: data,
        },
        include: {
          ingredientsSections: {
            include: {
              sectionIngredients: {
                include: {
                  ingredient: true,
                },
              },
              subRecipe: {
                include: {
                  ingredientsSections: {
                    include: {
                      sectionIngredients: {
                        include: {
                          ingredient: true,
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: {
              isDefault: 'desc',
            },
          },
        },
      })

      if (!result) {
        throw notFound()
      }

      return {
        ...result,
        image: getFileUrl(result.image),
      }
    })
  )

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeSection = Recipe['ingredientsSections'][number]

const getRecipeQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ['recipes', id.toString()],
    queryFn: () => getRecipe({ data: typeof id === 'string' ? Number.parseInt(id) : id }),
  })

export { getRecipe, getRecipeQueryOptions }
