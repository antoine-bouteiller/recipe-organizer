import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { toastError } from '@client/lib/toast-helpers'
import { toastManager } from '@recipe-organizer/design-system/toast'
import { mutationOptions } from '@tanstack/react-query'

const blockUserOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: { id: string } }) => readResponse(apiClient.users.block.$post({ json: data })),
    onError: (error) => {
      toastError("Erreur lors du blocage de l'utilisateur", error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.allUsers,
      })
      toastManager.add({ title: 'Utilisateur bloqué', type: 'success' })
    },
  })

export { blockUserOptions }
