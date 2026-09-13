import { toastManager } from '@client/components/ui/toast'
import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { toastError } from '@client/lib/toast-helpers'
import { type UpdateIngredientFormValues } from '@recipe-organizer/shared/ingredients/schemas'
import { mutationOptions } from '@tanstack/react-query'

export { type UpdateIngredientFormInput, updateIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'

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
