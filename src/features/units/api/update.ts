import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

export const updateUnitSchema = v.object({
  factor: v.optional(v.pipe(v.number(), v.minValue(0))),
  id: v.number(),
  name: v.pipe(v.string(), v.minLength(2)),
  parentId: v.optional(v.number()),
  symbol: v.pipe(v.string(), v.minLength(1)),
})

export type UpdateUnitFormValues = v.InferOutput<typeof updateUnitSchema>
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
