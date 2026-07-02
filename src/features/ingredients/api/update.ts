import { ingredient } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/lib/auth/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'
import { withServerError } from '@/utils/error-handler'

import { ingredientSchema } from './create'

const updateIngredientSchema = v.object({ ...ingredientSchema.entries, id: v.number() })

type UpdateIngredientFormValues = v.InferOutput<typeof updateIngredientSchema>
export type UpdateIngredientFormInput = Partial<UpdateIngredientFormValues>

const updateIngredient = createServerFn()
  .middleware([authGuard()])
  .validator(updateIngredientSchema)
  .handler(
    withServerError(async ({ data }) => {
      const { id, ...newIngredient } = data

      await getDb().update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
    })
  )

const updateIngredientOptions = () =>
  mutationOptions({
    mutationFn: updateIngredient,
    onError: (error, variables) => {
      toastError(`Erreur lors de la mise à jour de l'ingrédient ${variables.data.name}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
      toastManager.add({
        title: `Ingrédient ${variables.data.name} mis à jour`,
        type: 'success',
      })
    },
  })

export { updateIngredientOptions, updateIngredientSchema }
