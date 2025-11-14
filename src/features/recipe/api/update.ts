import { authGuard } from '@/features/auth/auth-guard'
import { recipeSchema } from '@/features/recipe/api/create'
import { getDb } from '@/lib/db'
import { recipe, recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema'
import { withServerErrorCapture } from '@/lib/error-handler'
import { parseFormData } from '@/lib/form-data'
import { deleteFile, uploadFile } from '@/lib/r2'
import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { recipesQueryKeys } from './query-keys'

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
      const { image, sections, name, steps, id, quantity } = data

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
            name,
            image: imageKey,
            steps,
            quantity,
          })
          .where(eq(recipe.id, id))
          .returning({ id: recipe.id }),

        getDb().delete(recipeIngredientsSection).where(eq(recipeIngredientsSection.recipeId, id)),
      ])

      await Promise.all(
        sections.map(async (section, index) => {
          if ('recipeId' in section) {
            await getDb().insert(recipeIngredientsSection).values({
              recipeId: currentRecipe.id,
              subRecipeId: section.recipeId,
              name: section.name,
              ratio: section.ratio,
            })
          } else if ('ingredients' in section) {
            const [updatedSection] = await getDb()
              .insert(recipeIngredientsSection)
              .values({
                recipeId: currentRecipe.id,
                name: section.name,
                isDefault: index === 0,
              })
              .returning()

            if (section.ingredients.length > 0) {
              await getDb()
                .insert(sectionIngredient)
                .values(
                  section.ingredients.map((ingredient) => ({
                    sectionId: updatedSection.id,
                    ingredientId: ingredient.id,
                    quantity: ingredient.quantity,
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
    onSuccess: (data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: recipesQueryKeys.lists() })
      void context.client.invalidateQueries({ queryKey: recipesQueryKeys.detail(data) })
    },
  })

export {
  updateRecipeOptions,
  updateRecipeSchema,
  type UpdateRecipeFormInput,
  type UpdateRecipeFormValues,
}
