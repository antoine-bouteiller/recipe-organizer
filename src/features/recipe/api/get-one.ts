import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

import { ingredientGroupSelect } from '../utils/constants'

const getRecipeSchema = type('number')

const getRecipe = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipeSchema)
  .handler(
    withServerError(async ({ data }) => {
      const result = await getDb().query.recipe.findFirst({
        where: { id: data },
        with: {
          ingredientGroups: {
            ...ingredientGroupSelect,
          },
          linkedRecipes: {
            with: {
              linkedRecipe: {
                columns: {
                  id: true,
                  name: true,
                },
                with: {
                  ingredientGroups: {
                    ...ingredientGroupSelect,
                    where: {
                      isDefault: true,
                    },
                  },
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
