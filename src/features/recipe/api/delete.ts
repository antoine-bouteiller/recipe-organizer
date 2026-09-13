import { mutationOptions } from '@tanstack/react-query'

import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

const deleteRecipe = async ({ data }: { data: number }) => readResponse(apiClient.recipes.delete.$post({ json: data }))

const deleteRecipeOptions = () =>
  mutationOptions({
    mutationFn: deleteRecipe,
    onSuccess: (_data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.allRecipes })
    },
  })

export { deleteRecipeOptions }
