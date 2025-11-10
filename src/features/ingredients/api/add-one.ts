import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const ingredientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  parentId: z.number().nullish(),
  factor: z.number().positive('Le facteur doit être positif').nullish(),
})

const createIngredient = createServerFn()
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    const { name, category, parentId, factor } = data

    await getDb().insert(ingredient).values({
      name,
      category,
      parentId: parentId ?? null,
      factor: factor ?? null,
    })
  })

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: createIngredient,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: ingredientsQueryKeys.list() })
    },
  })

export { createIngredientOptions, ingredientSchema }
