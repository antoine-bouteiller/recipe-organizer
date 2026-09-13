import { mutationOptions } from '@tanstack/react-query'

import { toastManager } from '@/components/ui/toast'
import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

import { getTitle } from '../utils/get-recipe-title'
import { recipeFormDataToWire } from './schemas'

export { recipeSchema, type RecipeFormInput } from './schemas'

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
