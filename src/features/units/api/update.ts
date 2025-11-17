import { toastError } from '@/components/ui/sonner'
import { authGuard } from '@/features/auth/auth-guard'
import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { z } from 'zod'
import { unitKeys } from './query-keys'

export const updateUnitSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  symbol: z.string().min(1),
  parentId: z.number().nullable().optional(),
  factor: z.number().positive().nullable().optional(),
})

export type UpdateUnitFormValues = z.infer<typeof updateUnitSchema>
export type UpdateUnitFormInput = Partial<z.input<typeof updateUnitSchema>>

const updateUnit = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(updateUnitSchema)
  .handler(async ({ data }) => {
    const { id, name, symbol, parentId, factor } = data
    await getDb()
      .update(unit)
      .set({
        name,
        symbol,
        parentId: parentId ?? undefined,
        factor: factor ?? undefined,
      })
      .where(eq(unit.id, id))
  })

const updateUnitOptions = () =>
  mutationOptions({
    mutationFn: updateUnit,
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: unitKeys.all })
      toast.success(`Unité ${variables.data.name} mise à jour`)
    },
    onError: (error, variables) => {
      toastError(
        `Une erreur est survenue lors de la modification de l'unité ${variables.data.name}`,
        error
      )
    },
  })

export { updateUnitOptions }
