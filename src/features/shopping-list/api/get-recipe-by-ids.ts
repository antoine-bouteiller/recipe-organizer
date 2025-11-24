import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema/recipe'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { inArray } from 'drizzle-orm'
import { z } from 'zod'

const getRecipesByIds = createServerFn({
  method: 'GET',
})
  .inputValidator(
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
                  unit: true,
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

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    queryKey: queryKeys.recipeListByIds(ids),
    queryFn: () => getRecipesByIds({ data: { ids } }),
  })

export { getRecipeByIdsOptions }
