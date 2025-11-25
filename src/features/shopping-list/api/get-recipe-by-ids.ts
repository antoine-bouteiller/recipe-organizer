import { getDb } from '@/lib/db'
import {
  ingredient,
  recipe,
  recipeIngredientsSection,
  sectionIngredient,
  unit,
} from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, inArray, ne } from 'drizzle-orm'
import { z } from 'zod'
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
          quantity: recipe.quantity,
          ingredient: {
            id: ingredient.id,
            name: ingredient.name,
            category: ingredient.category,
            parentId: ingredient.parentId,
          },
          ingredientDetails: {
            quantity: sectionIngredient.quantity,
            unit: unit.name,
          },
        })
        .from(recipe)
        .leftJoin(recipeIngredientsSection, eq(recipe.id, recipeIngredientsSection.recipeId))
        .leftJoin(sectionIngredient, eq(sectionIngredient.sectionId, recipeIngredientsSection.id))
        .leftJoin(ingredient, eq(sectionIngredient.ingredientId, ingredient.id))
        .leftJoin(unit, eq(sectionIngredient.unitId, unit.id))
        .where(and(ne(ingredient.category, 'spices'), inArray(recipe.id, data.ids)))

      const result = rows.reduce<Record<number, RecipeById>>((acc, row) => {
        const { ingredient, ingredientDetails } = row
        if (!acc[row.id]) {
          acc[row.id] = {
            id: row.id,
            quantity: row.quantity,
            ingredients: [],
          }
        }
        if (ingredient && ingredientDetails.quantity) {
          acc[row.id].ingredients.push({
            ...ingredient,
            quantity: ingredientDetails.quantity,
            parentId: ingredient.parentId,
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
    queryKey: queryKeys.recipeListByIds(ids),
    queryFn: () => getRecipesByIds({ data: { ids } }),
  })

export { getRecipeByIdsOptions }
