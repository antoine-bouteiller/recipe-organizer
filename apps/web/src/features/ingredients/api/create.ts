import { alertError } from '@client/lib/alert-error'
import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import type { IngredientFormValues } from '@recipe-organizer/shared/ingredients/schemas'
import { mutationOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

export { ingredientSchema, type IngredientFormInput } from '@recipe-organizer/shared/ingredients/schemas'

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: ({ data }: { data: IngredientFormValues }) => readResponse(fetch('/api/ingredients', { body: data, method: 'POST' })),
    onError: (error, variables) => {
      alertError(`Erreur lors de la création de l'ingrédient ${variables.data.name}`, error)
    },
    onSuccess: async (_data, _variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
    },
  })

export { createIngredientOptions }
