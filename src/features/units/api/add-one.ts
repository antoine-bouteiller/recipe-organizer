import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { unitKeys } from './query-keys'

const unitSchema = z.object({
  name: z.string().min(2),
  symbol: z.string().min(1),
  parentId: z.number().nullable().optional(),
  factor: z.number().positive().nullable().optional(),
})

const createUnit = createServerFn()
  .inputValidator(unitSchema)
  .handler(async ({ data }) => {
    const { name, symbol, parentId, factor } = data
    await getDb().insert(unit).values({
      name,
      symbol,
      parentId: parentId ?? null,
      factor: factor ?? null,
    })
  })

const createUnitOptions = () =>
  mutationOptions({
    mutationFn: createUnit,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: unitKeys.all })
    },
  })

export { createUnitOptions }
