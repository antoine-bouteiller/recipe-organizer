import { toastManager } from '@client/components/ui/toast'
import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { toastError } from '@client/lib/toast-helpers'
import { type UserFormValues } from '@shared/users/schemas'
import { mutationOptions } from '@tanstack/react-query'

export { type UserFormInput, userSchema } from '@shared/users/schemas'

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
