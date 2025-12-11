import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, inArray, ne } from 'drizzle-orm'
import { z } from 'zod'

import { getDb } from '@/lib/db'
import { groupIngredient, ingredient, recipe, recipeIngredientGroup, unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'

import type { RecipeById } from '../types/recipe-by-id'

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
      const rows = await getDb()
        .select({
          id: recipe.id,
          ingredient: {
            category: ingredient.category,
            id: ingredient.id,
            name: ingredient.name,
            parentId: ingredient.parentId,
          },
          ingredientDetails: {
            quantity: groupIngredient.quantity,
            unit: unit.name,
          },
          servings: recipe.servings,
        })
        .from(recipe)
        .leftJoin(recipeIngredientGroup, eq(recipe.id, recipeIngredientGroup.recipeId))
        .leftJoin(groupIngredient, eq(groupIngredient.groupId, recipeIngredientGroup.id))
        .leftJoin(ingredient, eq(groupIngredient.ingredientId, ingredient.id))
        .leftJoin(unit, eq(groupIngredient.unitId, unit.id))
        .where(and(ne(ingredient.category, 'spices'), inArray(recipe.id, data.ids)))

      const result = rows.reduce<Record<number, RecipeById>>((acc, row) => {
        const { ingredient, ingredientDetails } = row
        if (!acc[row.id]) {
          acc[row.id] = {
            id: row.id,
            ingredients: [],
            servings: row.servings,
          }
        }
        if (ingredient && ingredientDetails.quantity) {
          acc[row.id].ingredients.push({
            ...ingredient,
            parentId: ingredient.parentId,
            quantity: ingredientDetails.quantity,
            unit: ingredientDetails.unit ?? undefined,
          })
        }
        return acc
      }, {})

      return Object.values(result)
    })
  )

const getRecipeByIdsOptions = (ids: number[]) =>
  queryOptions({
    queryFn: () => getRecipesByIds({ data: { ids } }),
    queryKey: queryKeys.recipeListByIds(ids),
  })

export { getRecipeByIdsOptions }
