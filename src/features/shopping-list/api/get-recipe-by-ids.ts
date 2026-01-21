import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

const getRecipesByIdsSchema = type({
  ids: 'number[]',
})

const getRecipesByIds = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipesByIdsSchema)
  .handler(
    withServerError(async ({ data }) => {
      const rows = await getDb().query.recipe.findMany({
        where: {
          id: {
            arrayContains: data.ids,
          },
        },
        with: {
          ingredientGroups: {
            with: {
              groupIngredients: {
                with: {
                  ingredient: true,
                  unit: true,
                },
                where: {
                  ingredient: {
                    category: {
                      NOT: 'spices',
                    },
                  },
                },
              },
            },
          },
        },
      })

      return rows.map((row) => ({
        id: row.id,
        ingredients: row.ingredientGroups
          .flatMap((group) => group.groupIngredients)
          .map((gi) => ({
            category: gi.ingredient.category,
            id: gi.ingredient.id,
            name: gi.ingredient.name,
            parentId: gi.ingredient.parentId,
            quantity: gi.quantity,
            unit: gi.unit?.name,
          })),
        servings: row.servings,
      }))
    })
  )

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    queryFn: () => getRecipesByIds({ data: { ids } }),
    queryKey: queryKeys.recipeListByIds(ids),
  })

export { getRecipeByIdsOptions }
