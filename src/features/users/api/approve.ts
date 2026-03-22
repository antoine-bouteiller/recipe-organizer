import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

const approveUserSchema = z.object({
  id: z.string(),
})

const approveUser = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(approveUserSchema)
  .handler(async ({ data }) => {
    const { id } = data
    await getDb().update(user).set({ status: 'active' }).where(eq(user.id, id))
  })

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
