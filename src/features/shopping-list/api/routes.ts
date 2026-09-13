import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { type ApiEnvironment } from '@/lib/api-context'
import { scaleQuantity } from '@/utils/scale-quantity'

import { ingredientGroupSelect } from '../utils/ingredient-group-select'

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

export const shoppingListRoutes = new Hono<ApiEnvironment>().get('/recipes', zValidator('query', idsSchema), async (context) => {
  const { ids } = context.req.valid('query')
  const rows = await context.env.db.query.recipe.findMany({
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
  return context.json(
    rows.map((row) => ({
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
  )
})
