import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { unitKeys } from './query-keys'

const deleteUnitSchema = z.object({
  id: z.number(),
})

const deleteUnit = createServerFn()
  .inputValidator(deleteUnitSchema)
  .handler(async ({ data }) => {
    const { id } = data
    await getDb().delete(unit).where(eq(unit.id, id))
  })

const deleteUnitOptions = () =>
  mutationOptions({
    mutationFn: deleteUnit,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({ queryKey: unitKeys.all })
    },
  })

export { deleteUnitOptions }
