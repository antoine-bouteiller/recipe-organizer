import { defineHandler } from 'void'
import * as z from 'zod'

import { ingredientGroupSelect } from '@/features/shopping-list/server/ingredient-group-select'
import { getDb } from '@/lib/server/db'
import { scaleQuantity } from '@/utils/scale-quantity'

const idsSchema = z.object({
  ids: z
    .string()
    .refine((value) => {
      try {
        return Array.isArray(JSON.parse(value))
      } catch {
        return false
      }
    })
    .transform((value) => JSON.parse(value))
    .pipe(z.array(z.number())),
})

export const GET = defineHandler.withValidator({ query: idsSchema })(async (_context, { query }) => {
  const { ids } = query
  const rows = await getDb().query.recipe.findMany({
    columns: { id: true, servings: true },
    where: { id: { in: ids } },
    with: {
      ingredientGroups: { ...ingredientGroupSelect },
      linkedRecipes: {
        columns: { ratio: true },
        with: {
          linkedRecipe: {
            columns: { servings: true },
            with: { ingredientGroups: { ...ingredientGroupSelect } },
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
            quantity: scaleQuantity(groupIngredient.quantity, ratio, linkedRecipe.servings),
            unitSlug: groupIngredient.unitSlug,
          }))
      ),
    ],
    servings: row.servings,
  }))
})
