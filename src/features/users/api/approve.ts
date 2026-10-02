import { alertError } from '@client/lib/alert-error'
import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const approveUserOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: { id: string } }) => readResponse(fetch('/api/users/approve', { body: data, method: 'POST' })),
    onError: (error) => {
      alertError("Erreur lors de l'approbation de l'utilisateur", error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.allUsers,
      })
    },
  })

export { approveUserOptions }
