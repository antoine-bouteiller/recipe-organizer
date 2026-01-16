import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient, ingredientCategory } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const ingredientSchema = type({
  category: type.enumerated(...ingredientCategory),
  name: 'string>=2',
  'parentId?': 'number',
})

export type IngredientFormValues = typeof ingredientSchema.infer
export type IngredientFormInput = Partial<IngredientFormValues>

const createIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    await getDb().insert(ingredient).values(data)
  })

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: createIngredient,
    onError: (error, variables) => {
      toastError(`Erreur lors de la création de l'ingrédient ${(variables as { data: IngredientFormValues }).data.name}`, error)
    },
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
      toastManager.add({
        title: `Ingrédient ${(variables as { data: IngredientFormValues }).data.name} créé`,
        type: 'success',
      })
    },
  })

export { createIngredientOptions, ingredientSchema }
