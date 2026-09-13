import { mutationOptions } from '@tanstack/react-query'

import { toastManager } from '@/components/ui/toast'
import { apiClient, readResponse } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'

import { type UpdateIngredientFormValues } from './schemas'

export { type UpdateIngredientFormInput, updateIngredientSchema } from './schemas'

const updateIngredientOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: UpdateIngredientFormValues }) => readResponse(apiClient.ingredients.update.$post({ json: data })),
    onError: (error, variables) => {
      toastError(`Erreur lors de la mise à jour de l'ingrédient ${variables.data.name}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
      toastManager.add({
        title: `Ingrédient ${variables.data.name} mis à jour`,
        type: 'success',
      })
    },
  })

export { updateIngredientOptions }
