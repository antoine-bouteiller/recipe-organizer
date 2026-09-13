import { mutationOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const deleteIngredientOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: { id: number } }) => readResponse(apiClient.ingredients.delete.$post({ json: data })),
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
    },
  })

export { deleteIngredientOptions }
