import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

import { ingredientSchema } from './create'

const updateIngredientSchema = ingredientSchema.merge({ id: 'number' })

export type UpdateIngredientFormValues = typeof updateIngredientSchema.infer
export type UpdateIngredientFormInput = Partial<UpdateIngredientFormValues>

const updateIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(updateIngredientSchema)
  .handler(async ({ data }) => {
    const { id, ...newIngredient } = data

    await getDb().update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
  })

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
