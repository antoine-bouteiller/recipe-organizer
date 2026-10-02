import { alertError } from '@client/lib/alert-error'
import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

import { getTitle } from '../utils/get-recipe-title'

export { recipeSchema, type RecipeFormInput } from '@recipe-organizer/shared/recipe/schemas'

const createRecipe = async ({ data }: { data: FormData }) => readResponse(fetch('/api/recipes', { body: data, method: 'POST' }))

const createRecipeOptions = () =>
  mutationOptions({
    mutationFn: createRecipe,
    onError: (error, variables, _context) => {
      alertError(`Erreur lors de la création de la recette ${getTitle(variables.data)}`, error)
    },
    onSuccess: (_data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.recipeLists() })
    },
  })

export { createRecipeOptions }
