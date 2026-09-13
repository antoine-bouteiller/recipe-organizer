import { mutationOptions } from '@tanstack/react-query'

import { toastManager } from '@/components/ui/toast'
import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

import { type UserFormValues } from './schemas'

export { type UserFormInput, userSchema } from './schemas'

const createUserOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: UserFormValues }) => readResponse(apiClient.users.$post({ json: data })),
    onError: (error, variables) => {
      toastError(`Erreur lors de la création de l'utilisateur ${variables.data.email}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listUsers(),
      })
      toastManager.add({
        title: `Utilisateur ${variables.data.email} créé`,
        type: 'success',
      })
    },
  })

export { createUserOptions }
