import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { unitKeys } from './query-keys'

const updateUnitSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  symbol: z.string().min(1),
  parentId: z.number().nullable().optional(),
  factor: z.number().positive().nullable().optional(),
})

const updateUnit = createServerFn()
  .inputValidator(updateUnitSchema)
  .handler(async ({ data }) => {
    const { id, name, symbol, parentId, factor } = data
    await getDb()
      .update(unit)
      .set({
        name,
        symbol,
        parentId: parentId ?? null,
        factor: factor ?? null,
      })
      .where(eq(unit.id, id))
  })

const updateUnitOptions = () =>
  mutationOptions({
    mutationFn: updateUnit,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: unitKeys.all })
    },
  })

export { updateUnitOptions }
