import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

import { ingredientGroupSelect } from '../utils/ingredient-group-select'

const getRecipesByIdsSchema = z.object({
  ids: z.array(z.number()),
})

const getRecipesByIds = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipesByIdsSchema)
  .handler(
    withServerError(async ({ data }) => {
      const rows = await getDb().query.recipe.findMany({
        columns: {
          id: true,
          servings: true,
        },
        where: {
          id: {
            in: data.ids,
          },
        },
        with: {
          ingredientGroups: {
            ...ingredientGroupSelect,
          },
          linkedRecipes: {
            columns: {
              ratio: true,
            },
            with: {
              linkedRecipe: {
                columns: {
                  servings: true,
                },
                with: {
                  ingredientGroups: {
                    ...ingredientGroupSelect,
                  },
                },
              },
            },
          },
        },
      })

      return rows.map((row) => ({
        id: row.id,
        ingredients: [
          ...row.ingredientGroups
            .flatMap((group) => group.groupIngredients)
            .map((groupIngredient) => ({
              category: groupIngredient.ingredient.category,
              countWeightG: groupIngredient.ingredient.countWeightG,
              densityGPerMl: groupIngredient.ingredient.densityGPerMl,
              id: groupIngredient.ingredient.id,
              name: groupIngredient.ingredient.name,
              parentId: groupIngredient.ingredient.parentId,
              preferredUnitSlug: groupIngredient.ingredient.preferredUnitSlug,
              quantity: groupIngredient.quantity,
              unitSlug: groupIngredient.unitSlug,
            })),
          ...row.linkedRecipes.flatMap(({ linkedRecipe, ratio }) =>
            linkedRecipe.ingredientGroups
              .flatMap((group) => group.groupIngredients)
              .map((groupIngredient) => ({
                category: groupIngredient.ingredient.category,
                countWeightG: groupIngredient.ingredient.countWeightG,
                densityGPerMl: groupIngredient.ingredient.densityGPerMl,
                id: groupIngredient.ingredient.id,
                name: groupIngredient.ingredient.name,
                parentId: groupIngredient.ingredient.parentId,
                preferredUnitSlug: groupIngredient.ingredient.preferredUnitSlug,
                quantity: (groupIngredient.quantity * ratio) / linkedRecipe.servings,
                unitSlug: groupIngredient.unitSlug,
              }))
          ),
        ],
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
