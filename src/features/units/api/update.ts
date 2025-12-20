import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'
import { eq } from 'drizzle-orm'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

export const updateUnitSchema = type({
  'factor?': 'number>0',
  id: 'number',
  name: 'string>=2',
  'parentId?': 'number',
  symbol: 'string>=1',
})

export type UpdateUnitFormValues = typeof updateUnitSchema.infer
export type UpdateUnitFormInput = Partial<UpdateUnitFormValues>

const updateUnit = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(updateUnitSchema)
  .handler(async ({ data }) => {
    const { id, ...newUnit } = data

    await getDb().update(unit).set(newUnit).where(eq(unit.id, id))
  })

const updateUnitOptions = () =>
  mutationOptions({
    mutationFn: updateUnit,
    onError: (error, variables) => {
      toastError(`Une erreur est survenue lors de la modification de l'unité ${variables.data.name}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: queryKeys.allUnits })
      toastManager.add({
        title: `Unité ${variables.data.name} mise à jour`,
        type: 'success',
      })
    },
  })

export { updateUnitOptions }
