import { ingredient } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db, eq } from 'void/db'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

const deleteIngredientSchema = v.object({
  id: v.number(),
})

const deleteIngredient = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(deleteIngredientSchema)
  .handler(
    withServerError(async ({ data }) => {
      const { id } = data
      await db.delete(ingredient).where(eq(ingredient.id, id))
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
