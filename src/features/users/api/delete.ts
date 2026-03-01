import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const deleteUserSchema = v.object({
  id: v.string(),
})

const deleteUser = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(deleteUserSchema)
  .handler(async ({ data }) => {
    const { id } = data
    await getDb().delete(user).where(eq(user.id, id))
  })

const deleteUserOptions = () =>
  mutationOptions({
    mutationFn: deleteUser,
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listUsers(),
      })
    },
  })

export { deleteUserOptions }
