import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient, ingredientCategory } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const ingredientSchema = z.object({
  category: z.enum(ingredientCategory),
  name: z.string().min(2),
  parentId: z.number().optional(),
})

export interface IngredientFormValues {
  category: (typeof ingredientCategory)[number]
  name: string
  parentId?: number
}
export type IngredientFormInput = Partial<IngredientFormValues>

const createIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    await getDb().insert(ingredient).values(data as IngredientFormValues)
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
