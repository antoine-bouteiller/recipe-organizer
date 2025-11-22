import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const ingredientSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  category: z.string().min(1, 'La catégorie est requise'),
})

export type IngredientFormValues = z.infer<typeof ingredientSchema>
export type IngredientFormInput = Partial<z.input<typeof ingredientSchema>>

const createIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(ingredientSchema)
  .handler(async ({ data }) => {
    const { name, category } = data

    await getDb().insert(ingredient).values({
      name,
      category,
    })
  })

const createIngredientOptions = () =>
  mutationOptions({
    mutationFn: createIngredient,
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: ingredientsQueryKeys.list(),
      })
      toastManager.add({
        title: `Ingrédient ${variables.data.name} créé`,
        type: 'success',
      })
    },
    onError: (error, variables) => {
      toastError(`Erreur lors de la création de l'ingrédient ${variables.data.name}`, error)
    },
  })

export { createIngredientOptions, ingredientSchema }
