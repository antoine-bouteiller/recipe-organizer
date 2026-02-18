import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const deleteIngredientSchema = v.object({
  id: v.number(),
})

const deleteIngredient = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(deleteIngredientSchema)
  .handler(async ({ data }) => {
    const { id } = data
    await getDb().delete(ingredient).where(eq(ingredient.id, id))
  })

const deleteIngredientOptions = () =>
  mutationOptions({
    mutationFn: deleteIngredient,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
    },
  })

export { deleteIngredientOptions }
