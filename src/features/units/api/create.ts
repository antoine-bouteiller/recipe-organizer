import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { unitKeys } from './query-keys'

const unitSchema = z.object({
  name: z.string().min(2),
  parentId: z.number().optional(),
  factor: z.number().positive().optional(),
})

export type UnitFormValues = z.infer<typeof unitSchema>
export type UnitFormInput = Partial<z.input<typeof unitSchema>>

const createUnit = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(unitSchema)
  .handler(async ({ data }) => {
    await getDb().insert(unit).values(data)
  })

const createUnitOptions = () =>
  mutationOptions({
    mutationFn: createUnit,
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: unitKeys.all })
      toastManager.add({
        title: `Unité ${variables.data.name} créée`,
        type: 'success',
      })
    },
    onError: (error, variables) => {
      toastError(
        `Une erreur est survenue lors de la création de l'unité ${variables.data.name}`,
        error
      )
    },
  })

export { createUnitOptions, unitSchema }
