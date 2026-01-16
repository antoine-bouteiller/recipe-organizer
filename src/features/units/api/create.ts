import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const unitSchema = type({
  'factor?': 'number>0',
  name: 'string>=2',
  'parentId?': 'number',
})

export type UnitFormValues = typeof unitSchema.infer
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
