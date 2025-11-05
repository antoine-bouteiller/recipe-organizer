import { getDb } from '@/lib/db'
import { ingredient, ingredientUnit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const updateIngredientSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  unitIds: z.array(z.number()).optional(),
  category: z.string().optional(),
})

const updateIngredient = createServerFn()
  .inputValidator(updateIngredientSchema)
  .handler(async ({ data }) => {
    const { id, name, unitIds, category } = data
    const db = getDb()

    await db
      .update(ingredient)
      .set({
        name,
        category,
      })
      .where(eq(ingredient.id, id))

    // Delete existing unit relationships
    await db.delete(ingredientUnit).where(eq(ingredientUnit.ingredientId, id))

    // Insert new unit relationships
    if (unitIds && unitIds.length > 0) {
      await db.insert(ingredientUnit).values(
        unitIds.map((unitId) => ({
          ingredientId: id,
          unitId,
        }))
      )
    }
  })

const updateIngredientOptions = () =>
  mutationOptions({
    mutationFn: updateIngredient,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: ingredientsQueryKeys.list() })
    },
  })

export { updateIngredientOptions }
