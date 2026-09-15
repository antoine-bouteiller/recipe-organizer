import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { toastError } from '@client/lib/toast-helpers'
import { toastManager } from '@recipe-organizer/design-system/toast'
import { updateRecipeFormDataToWire } from '@recipe-organizer/shared/recipe/schemas'
import { mutationOptions } from '@tanstack/react-query'

import { getTitle } from '../utils/get-recipe-title'

export { updateRecipeSchema, type UpdateRecipeFormInput } from '@recipe-organizer/shared/recipe/schemas'

const updateRecipe = async ({ data }: { data: FormData }) => readResponse(apiClient.recipes.update.$post({ form: updateRecipeFormDataToWire(data) }))

const updateRecipeOptions = () =>
  mutationOptions({
    mutationFn: updateRecipe,
    onError: (error, variables) => {
      toastError(`Erreur lors de la mise à jour de la recette ${getTitle(variables.data)}`, error)
    },
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.allRecipes })
      toastManager.add({ title: `Recette ${getTitle(variables.data)} mise à jour`, type: 'success' })
    },
  })

export { updateRecipeOptions }
