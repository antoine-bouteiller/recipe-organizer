import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const unitSchema = v.object({
  factor: v.optional(v.pipe(v.number(), v.minValue(0))),
  name: v.pipe(v.string(), v.minLength(2)),
  parentId: v.optional(v.number()),
})

export type UnitFormValues = v.InferOutput<typeof unitSchema>
export type UnitFormInput = Partial<UnitFormValues>

const createUnit = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(unitSchema)
  .handler(async ({ data }) => {
    await getDb().insert(unit).values(data)
  })

const createUnitOptions = () =>
  mutationOptions({
    mutationFn: createUnit,
    onError: (error, variables) => {
      toastError(`Une erreur est survenue lors de la création de l'unité ${variables.data.name}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: queryKeys.allUnits })
      toastManager.add({
        title: `Unité ${variables.data.name} créée`,
        type: 'success',
      })
    },
  })

export { createUnitOptions, unitSchema }
