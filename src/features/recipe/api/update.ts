import { mutationOptions } from '@tanstack/react-query'

import { toastManager } from '@/components/ui/toast'
import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

import { getTitle } from '../utils/get-recipe-title'
import { updateRecipeFormDataToWire } from './schemas'

export { updateRecipeSchema, type UpdateRecipeFormInput } from './schemas'

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
