import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

export const updateUnitSchema = z.object({
  factor: z.number().positive().optional(),
  id: z.number(),
  name: z.string().min(2),
  parentId: z.number().optional(),
  symbol: z.string().min(1),
})

export type UpdateUnitFormValues = z.infer<typeof updateUnitSchema>
export type UpdateUnitFormInput = Partial<z.input<typeof updateUnitSchema>>

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
