import { ingredient, ingredientCategory, unitSlugSchema } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/lib/auth/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'
import { withServerError } from '@/utils/error-handler'

const ingredientSchema = z.object({
  category: z.enum(ingredientCategory),
  countWeightG: z.number().min(0).nullable().optional(),
  densityGPerMl: z.number().min(0).nullable().optional(),
  name: z.string().min(2),
  parentId: z.number().optional(),
  preferredUnitSlug: unitSlugSchema.nullable().optional(),
})

type IngredientFormValues = z.infer<typeof ingredientSchema>
export type IngredientFormInput = Partial<IngredientFormValues>

const createIngredient = createServerFn()
  .middleware([authGuard()])
  .validator(ingredientSchema)
  .handler(
    withServerError(async ({ data }) => {
      await getDb().insert(ingredient).values(data)
    })
  )

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
