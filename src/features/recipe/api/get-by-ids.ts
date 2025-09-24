import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { withServerErrorCapture } from '@/lib/error-handler'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { inArray } from 'drizzle-orm'
import z from 'zod'

const getRecipesByIds = createServerFn({
  method: 'GET',
  response: 'data',
})
  .validator(
    z.object({
      ids: z.array(z.number()),
    })
  )
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const recipes = await getDb().query.recipe.findMany({
        where: inArray(recipe.id, data.ids),
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
      })

      return recipes.map((recipe) => ({
        ...recipe,
        image: `/api/image/${recipe.image}`,
      }))
    })
  )

const getRecipesByIdsQueryOptions = (ids: number[]) =>
  queryOptions({
    queryKey: ['recipes', ids],
    queryFn: () => getRecipesByIds({ data: { ids } }),
  })

export { getRecipesByIds, getRecipesByIdsQueryOptions }
