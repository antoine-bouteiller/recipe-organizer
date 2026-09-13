import { mutationOptions } from '@tanstack/react-query'

import { toastManager } from '@/components/ui/toast'
import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

import { type IngredientFormValues } from './schemas'

export { ingredientSchema, type IngredientFormInput } from './schemas'

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: IngredientFormValues }) => readResponse(apiClient.ingredients.$post({ json: data })),
    onError: (error, variables) => {
      toastError(`Erreur lors de la création de l'ingrédient ${variables.data.name}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
      toastManager.add({
        title: `Ingrédient ${variables.data.name} créé`,
        type: 'success',
      })
    },
  })

export { createIngredientOptions }
