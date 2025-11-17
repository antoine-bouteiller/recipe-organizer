import { toastError } from '@/components/ui/sonner'
import { authGuard } from '@/features/auth/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { z } from 'zod'
import { unitKeys } from './query-keys'

const unitSchema = z.object({
  name: z.string().min(2),
  symbol: z.string().min(1),
  parentId: z.number().nullable().optional(),
  factor: z.number().positive().nullable().optional(),
})

export type UnitFormValues = z.infer<typeof unitSchema>
export type UnitFormInput = Partial<z.input<typeof unitSchema>>

const createUnit = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(unitSchema)
  .handler(async ({ data }) => {
    const { name, symbol, parentId, factor } = data
    await getDb()
      .insert(unit)
      .values({
        name,
        symbol,
        parentId: parentId ?? undefined,
        factor: factor ?? undefined,
      })
  })

const createUnitOptions = () =>
  mutationOptions({
    mutationFn: createUnit,
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: unitKeys.all })
      toast.success(`Unité ${variables.data.name} créée`)
    },
    onError: (error, variables) => {
      toastError(
        `Une erreur est survenue lors de la création de l'unité ${variables.data.name}`,
        error
      )
    },
  })

export { createUnitOptions, unitSchema }
