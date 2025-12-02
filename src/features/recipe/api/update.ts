import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { recipeSchema } from '@/features/recipe/api/create'
import { getDb } from '@/lib/db'
import { recipe, recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { deleteFile, uploadFile } from '@/lib/r2'
import { withServerErrorCapture } from '@/utils/error-handler'
import { parseFormData } from '@/utils/form-data'

const updateRecipeSchema = z.object({
  ...recipeSchema.shape,
  id: z.coerce.number(),
})

type UpdateRecipeFormValues = z.infer<typeof updateRecipeSchema>
type UpdateRecipeFormInput = Partial<z.input<typeof updateRecipeSchema>>

const updateRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => updateRecipeSchema.parse(parseFormData(formData)))
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const { id, image, name, quantity, sections, steps } = data

      const currentRecipe = await getDb().query.recipe.findFirst({
        where: eq(recipe.id, id),
      })

      if (!currentRecipe) {
        throw notFound()
      }

      let imageKey = currentRecipe.image

      if (image instanceof File) {
        await deleteFile(imageKey)
        imageKey = await uploadFile(image)
      }

      await getDb().batch([
        getDb()
          .update(recipe)
          .set({
            image: imageKey,
            name,
            quantity,
            steps,
          })
          .where(eq(recipe.id, id))
          .returning({ id: recipe.id }),

        getDb().delete(recipeIngredientsSection).where(eq(recipeIngredientsSection.recipeId, id)),
      ])

      await Promise.all(
        sections.map(async (section, index) => {
          if ('recipeId' in section) {
            await getDb().insert(recipeIngredientsSection).values({
              name: section.name,
              ratio: section.ratio,
              recipeId: currentRecipe.id,
              subRecipeId: section.recipeId,
            })
          } else if ('ingredients' in section) {
            const [updatedSection] = await getDb()
              .insert(recipeIngredientsSection)
              .values({
                isDefault: index === 0,
                name: section.name,
                recipeId: currentRecipe.id,
              })
              .returning()

            if (section.ingredients.length > 0) {
              await getDb()
                .insert(sectionIngredient)
                .values(
                  section.ingredients.map((ingredient) => ({
                    ingredientId: ingredient.id,
                    quantity: ingredient.quantity,
                    sectionId: updatedSection.id,
                    unitId: ingredient.unitId ?? undefined,
                  }))
                )
            }
          }
        })
      )

      return id
    })
  )

const updateRecipeOptions = () =>
  mutationOptions({
    mutationFn: updateRecipe,
    onError: (error, variables) => {
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastError(`Erreur lors de la mise à jour de la recette ${title}`, error)
    },
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({
        queryKey: queryKeys.allRecipes,
      })
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastManager.add({
        title: `Recette ${title} mise à jour`,
        type: 'success',
      })
    },
  })

export { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput, type UpdateRecipeFormValues }
