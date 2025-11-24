import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient, ingredientCategory } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updateIngredientSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  category: z.enum(ingredientCategory).optional(),
  parentId: z.number().optional(),
})

export type UpdateIngredientFormValues = z.infer<typeof updateIngredientSchema>
export type UpdateIngredientFormInput = Partial<z.input<typeof updateIngredientSchema>>

const updateIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(updateIngredientSchema)
  .handler(async ({ data }) => {
    const { id, ...newIngredient } = data

    await getDb().update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
  })

const updateIngredientOptions = () =>
  mutationOptions({
    mutationFn: updateIngredient,
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: queryKeys.listIngredients(),
      })
      toastManager.add({
        title: `Ingrédient ${variables.data.name} mis à jour`,
        type: 'success',
      })
    },
    onError: (error, variables) => {
      toastError(`Erreur lors de la mise à jour de l'ingrédient ${variables.data.name}`, error)
    },
  })

export { updateIngredientOptions, updateIngredientSchema }
