import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const deleteIngredientOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: { id: number } }) => readResponse(fetch('/api/ingredients/delete', { body: data, method: 'POST' })),
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
    },
  })

export { deleteIngredientOptions }
