import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'
import { eq } from 'drizzle-orm'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const deleteUnitSchema = type({
  id: 'number',
})

const deleteUnit = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(deleteUnitSchema)
  .handler(async ({ data }) => {
    const { id } = data
    await getDb().delete(unit).where(eq(unit.id, id))
  })

const deleteUnitOptions = () =>
  mutationOptions({
    mutationFn: deleteUnit,
    onError: (error, variables) => {
      toastError(`Une erreur est survenue lors de la suppression de l'unité ${(variables as { data: { id: number } }).data.id}`, error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: queryKeys.allUnits })
      toastManager.add({
        title: 'Unitée supprimée',
        type: 'success',
      })
    },
  })

export { deleteUnitOptions }
