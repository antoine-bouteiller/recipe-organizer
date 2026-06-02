import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db } from 'void/db'

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
      const result = await db.query.recipe.findFirst({
        where: (fields, { eq }) => eq(fields.id, id),
        with: {
          ingredientGroups: {
            orderBy: (fields, { desc }) => desc(fields.isDefault),
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
                    where: (fields, { eq }) => eq(fields.isDefault, true),
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
        ingredientGroups: result.ingredientGroups,
        instructions: result.instructions,
        linkedRecipes: result.linkedRecipes,
        name: result.name,
        servings: result.servings,
        tags: result.tags,
        video: result.video,
      }
    })
  )

export type Recipe = Awaited<ReturnType<typeof getRecipe>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]

export const getRecipeDetailsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipe({ data: id }),
    queryKey: queryKeys.recipeDetail(id),
  })
