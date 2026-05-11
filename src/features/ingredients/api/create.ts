import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient, ingredientCategory } from '@/lib/db/schema'
import { unitSlugSchema } from '@/lib/db/schema/unit'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'
import { withServerError } from '@/utils/error-handler'

const ingredientSchema = v.object({
  category: v.picklist([...ingredientCategory]),
  countWeightG: v.optional(
    v.nullable(
      v.pipe(
        v.number(),
        v.check((value) => value > 0, 'Doit être positif')
      )
    )
  ),
  densityGPerMl: v.optional(
    v.nullable(
      v.pipe(
        v.number(),
        v.check((value) => value > 0, 'Doit être positif')
      )
    )
  ),
  name: v.pipe(v.string(), v.minLength(2)),
  parentId: v.optional(v.number()),
  preferredUnitSlug: v.optional(v.nullable(unitSlugSchema)),
})

type IngredientFormValues = v.InferOutput<typeof ingredientSchema>
export type IngredientFormInput = Partial<IngredientFormValues>

const createIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(ingredientSchema)
  .handler(
    withServerError(async ({ data }) => {
      await getDb().insert(ingredient).values(data)
    })
  )

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: createIngredient,
    onError: (error) => {
      toastError(`Erreur lors de la création de l'ingrédient`, error)
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

export { createIngredientOptions, ingredientSchema }
