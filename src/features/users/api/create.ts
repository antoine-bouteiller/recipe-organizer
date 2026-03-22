import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

const userSchema = z.object({
  email: z.email(),
  role: z.enum(['user', 'admin']),
})

export type UserFormValues = z.infer<typeof userSchema>
export type UserFormInput = Partial<UserFormValues>

const createUser = createServerFn()
  .middleware([authGuard('admin')])
  .inputValidator(userSchema)
  .handler(async ({ data }) => {
    await getDb()
      .insert(user)
      .values({ ...data, id: crypto.randomUUID() })
  })

const createUserOptions = () =>
  mutationOptions({
    mutationFn: createUser,
    onError: (error, variables) => {
      toastError(`Erreur lors de la création de l'utilisateur ${(variables as { data: UserFormValues }).data.email}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listUsers(),
      })
      toastManager.add({
        title: `Utilisateur ${(variables as { data: UserFormValues }).data.email} créé`,
        type: 'success',
      })
    },
  })

export { createUserOptions, userSchema }
