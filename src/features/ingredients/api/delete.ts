import { ingredient } from '@schema'
import { mutationOptions } from '@tanstack/solid-query'
import { createServerFn } from '@tanstack/solid-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { authGuard } from '@/lib/auth/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

const deleteIngredientSchema = v.object({
  id: v.number(),
})

const deleteIngredient = createServerFn()
  .middleware([authGuard('admin')])
  .validator(deleteIngredientSchema)
  .handler(
    withServerError(async ({ data }) => {
      const { id } = data
      await getDb().delete(ingredient).where(eq(ingredient.id, id))
    })
  )

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
