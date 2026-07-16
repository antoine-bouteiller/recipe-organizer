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

const approveUserSchema = v.object({
  id: v.string(),
})

const approveUser = createServerFn()
  .middleware([authGuard('admin')])
  .validator(approveUserSchema)
  .handler(
    withServerError(async ({ data }) => {
      const { id } = data
      await getDb().update(user).set({ status: 'active' }).where(eq(user.id, id))
    })
  )

const approveUserOptions = () =>
  mutationOptions({
    mutationFn: approveUser,
    onError: (error) => {
      toastError("Erreur lors de l'approbation de l'utilisateur", error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.allUsers,
      })
      toastManager.add({
        title: `Utilisateur approuvé`,
        type: 'success',
      })
    },
  })

export { approveUserOptions }
