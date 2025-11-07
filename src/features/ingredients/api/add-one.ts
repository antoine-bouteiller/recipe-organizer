import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const ingredientSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
})

const createIngredient = createServerFn()
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    const { name, category } = data

    await getDb().insert(ingredient).values({
      name,
      category: category || 'supermarket',
    })
  })

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: createIngredient,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: ingredientsQueryKeys.list() })
    },
  })

export { createIngredientOptions }
