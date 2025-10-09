import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(2),
})

const createIngredient = createServerFn()
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    const { name } = data
    await getDb().insert(ingredient).values({
      name,
    })
  })

const useCreateIngredientMutation = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: createIngredient,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export { useCreateIngredientMutation }
