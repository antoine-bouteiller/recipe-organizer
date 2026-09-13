import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'

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
