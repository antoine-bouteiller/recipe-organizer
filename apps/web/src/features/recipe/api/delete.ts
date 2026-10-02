import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const deleteRecipe = async ({ data }: { data: number }) => readResponse(fetch('/api/recipes/delete', { body: data, method: 'POST' }))

const deleteRecipeOptions = () =>
  mutationOptions({
    mutationFn: deleteRecipe,
    onSuccess: (_data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.allRecipes })
    },
  })

export { deleteRecipeOptions }
