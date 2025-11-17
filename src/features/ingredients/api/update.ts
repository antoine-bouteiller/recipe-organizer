import { toastError } from '@/components/ui/sonner'
import { authGuard } from '@/features/auth/auth-guard'
import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { z } from 'zod'
import { ingredientsQueryKeys } from './query-keys'

const updateIngredientSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  category: z.string().optional(),
})

export type UpdateIngredientFormValues = z.infer<typeof updateIngredientSchema>
export type UpdateIngredientFormInput = Partial<z.input<typeof updateIngredientSchema>>

const updateIngredient = createServerFn()
  .middleware([authGuard()])
  .inputValidator(updateIngredientSchema)
  .handler(async ({ data }) => {
    const { id, name, category } = data

    await getDb()
      .update(ingredient)
      .set({
        name,
        category,
      })
      .where(eq(ingredient.id, id))
  })

const updateIngredientOptions = () =>
  mutationOptions({
    mutationFn: updateIngredient,
    onSuccess: async (_data, variables, _result, context) => {
      await context.client.invalidateQueries({
        queryKey: ingredientsQueryKeys.list(),
      })
      toast.success(`Ingrédient ${variables.data.name} mis à jour`)
    },
    onError: (error, variables) => {
      toastError(`Erreur lors de la mise à jour de l'ingrédient ${variables.data.name}`, error)
    },
  })

export { updateIngredientOptions, updateIngredientSchema }
