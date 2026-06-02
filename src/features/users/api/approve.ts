import { user } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db, eq } from 'void/db'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'
import { withServerError } from '@/utils/error-handler'

const approveUserSchema = v.object({
  id: v.string(),
})

const approveUser = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(approveUserSchema)
  .handler(
    withServerError(async ({ data }) => {
      const { id } = data
      await db.update(user).set({ status: 'active' }).where(eq(user.id, id))
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
