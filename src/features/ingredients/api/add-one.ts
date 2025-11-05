import { getDb } from '@/lib/db'
import { ingredient, ingredientUnit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const ingredientSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  unitIds: z.array(z.number()).optional(),
})

const createIngredient = createServerFn()
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    const { name, category, unitIds } = data
    const db = getDb()

    const result = await db
      .insert(ingredient)
      .values({
        name,
        category: category || 'supermarket',
      })
      .returning({ id: ingredient.id })

    if (unitIds && unitIds.length > 0 && result[0]) {
      await db.insert(ingredientUnit).values(
        unitIds.map((unitId) => ({
          ingredientId: result[0].id,
          unitId,
        }))
      )
    }
  })

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: createIngredient,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: ingredientsQueryKeys.list() })
    },
  })

export { createIngredientOptions }
