import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const updateIngredientSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  category: z.string().optional(),
})

const updateIngredient = createServerFn()
  .inputValidator(updateIngredientSchema)
  .handler(async ({ data }) => {
    const { id, name, category } = data

    await getDb()
      .update(ingredient)
      .set({
        name,
        category,
      })
      .where(eq(ingredient.id, id))
  })

const updateIngredientOptions = () =>
  mutationOptions({
    mutationFn: updateIngredient,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: ingredientsQueryKeys.list() })
    },
  })

export { updateIngredientOptions }
