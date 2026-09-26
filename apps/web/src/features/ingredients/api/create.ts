import { apiClient, readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { toastError } from '@client/lib/toast-helpers'
import { toastManager } from '@recipe-organizer/design-system/toast'
import type { IngredientFormValues } from '@recipe-organizer/shared/ingredients/schemas'
import { mutationOptions } from '@tanstack/react-query'

export { ingredientSchema, type IngredientFormInput } from '@recipe-organizer/shared/ingredients/schemas'

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
