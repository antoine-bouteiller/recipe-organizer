import { alertError } from '@client/lib/alert-error'
import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

import { getTitle } from '../utils/get-recipe-title'

export { updateRecipeSchema, type UpdateRecipeFormInput } from '@recipe-organizer/shared/recipe/schemas'

const updateRecipe = async ({ data }: { data: FormData }) => readResponse(fetch('/api/recipes/update', { body: data, method: 'POST' }))

const updateRecipeOptions = () =>
  mutationOptions({
    mutationFn: updateRecipe,
    onError: (error, variables) => {
      alertError(`Erreur lors de la mise à jour de la recette ${getTitle(variables.data)}`, error)
    },
    onSuccess: (_data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.allRecipes })
    },
  })

export { updateRecipeOptions }
