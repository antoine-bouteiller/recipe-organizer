import { user } from '@schema'
import { mutationOptions } from '@tanstack/solid-query'
import { createServerFn } from '@tanstack/solid-start'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/lib/auth/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'
import { withServerError } from '@/utils/error-handler'

const blockUserSchema = v.object({
  id: v.string(),
})

const blockUser = createServerFn()
  .middleware([authGuard('admin')])
  .validator(blockUserSchema)
  .handler(
    withServerError(async ({ data }) => {
      const { id } = data
      await getDb().update(user).set({ status: 'blocked' }).where(eq(user.id, id))
    })
  )

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
