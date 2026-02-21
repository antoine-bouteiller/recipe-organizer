import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'
import { getImageUrl } from '@/utils/get-file-url'

import { ingredientGroupSelect } from '../utils/ingredient-group-select'

const getRecipeSchema = v.number()

const getRecipe = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipeSchema)
  .handler(
    withServerError(async ({ data: id }) => {
      const result = await getDb().query.recipe.findFirst({
        where: { id },
        with: {
          ingredientGroups: {
            orderBy: {
              isDefault: 'desc',
            },
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
                    where: { isDefault: true },
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

      return {
        id: result.id,
        image: getImageUrl(result.image),
        instructions: result.instructions,
        name: result.name,
        servings: result.servings,
        tags: result.tags,
        video: result.video,
        ingredientGroups: result.ingredientGroups,
        linkedRecipes: result.linkedRecipes,
      }
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
