import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { toastError } from '@client/lib/toast-helpers'
import { toastManager } from '@recipe-organizer/design-system/toast'
import { recipeFormDataToWire } from '@recipe-organizer/shared/recipe/schemas'
import { mutationOptions } from '@tanstack/react-query'

import { getTitle } from '../utils/get-recipe-title'

export { recipeSchema, type RecipeFormInput } from '@recipe-organizer/shared/recipe/schemas'

const createRecipe = async ({ data }: { data: FormData }) => readResponse(apiClient.recipes.$post({ form: recipeFormDataToWire(data) }))

const createRecipeOptions = () =>
  mutationOptions({
    mutationFn: createRecipe,
    onError: (error, variables, _context) => {
      toastError(`Erreur lors de la création de la recette ${getTitle(variables.data)}`, error)
    },
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.recipeLists() })
      toastManager.add({ title: `Recette ${getTitle(variables.data)} créée`, type: 'success' })
    },
  })

export { createRecipeOptions }
