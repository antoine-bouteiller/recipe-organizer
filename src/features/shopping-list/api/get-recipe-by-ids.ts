import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

import { ingredientGroupSelect } from '../utils/ingredient-group-select'

const getRecipesByIdsSchema = v.object({
  ids: v.array(v.number()),
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
            in: data.ids,
          },
        },
        columns: {
          id: true,
          servings: true,
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
              id: groupIngredient.ingredient.id,
              name: groupIngredient.ingredient.name,
              parentId: groupIngredient.ingredient.parentId,
              quantity: groupIngredient.quantity,
              unit: groupIngredient.unit?.name,
            })),
          ...row.linkedRecipes.flatMap(({ linkedRecipe, ratio }) =>
            linkedRecipe.ingredientGroups
              .flatMap((group) => group.groupIngredients)
              .map((groupIngredient) => ({
                category: groupIngredient.ingredient.category,
                id: groupIngredient.ingredient.id,
                name: groupIngredient.ingredient.name,
                parentId: groupIngredient.ingredient.parentId,
                quantity: (groupIngredient.quantity * ratio) / linkedRecipe.servings,
                unit: groupIngredient.unit?.name,
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
