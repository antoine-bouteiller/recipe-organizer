import { alertError } from '@client/lib/alert-error'
import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import type { UserFormValues } from '@recipe-organizer/shared/users/schemas'
import { mutationOptions } from '@tanstack/react-query'

export { type UserFormInput, userSchema } from '@recipe-organizer/shared/users/schemas'

const createUserOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: UserFormValues }) => readResponse(apiClient.users.$post({ json: data })),
    onError: (error, variables) => {
      alertError(`Erreur lors de la création de l'utilisateur ${variables.data.email}`, error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listUsers(),
      })
    },
  })

export { createUserOptions }
