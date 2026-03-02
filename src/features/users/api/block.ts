import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const blockUserSchema = v.object({
  id: v.string(),
})

const blockUser = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(blockUserSchema)
  .handler(async ({ data }) => {
    const { id } = data
    await getDb().update(user).set({ status: 'blocked' }).where(eq(user.id, id))
  })

const blockUserOptions = () =>
  mutationOptions({
    mutationFn: blockUser,
    onError: (error) => {
      toastError("Erreur lors du blocage de l'utilisateur", error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.allUsers,
      })
      toastManager.add({
        title: `Utilisateur bloqué`,
        type: 'success',
      })
    },
  })

export { blockUserOptions }
