import { mutationOptions } from '@tanstack/react-query'

import { toastManager } from '@/components/ui/toast'
import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

const approveUserOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: { id: string } }) => readResponse(apiClient.users.approve.$post({ json: data })),
    onError: (error) => {
      toastError("Erreur lors de l'approbation de l'utilisateur", error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.allUsers,
      })
      toastManager.add({ title: 'Utilisateur approuvé', type: 'success' })
    },
  })

export { approveUserOptions }
