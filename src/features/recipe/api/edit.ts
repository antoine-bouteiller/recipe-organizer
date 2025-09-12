import { recipeSchema } from '@/features/recipe/api/create'
import { getDb } from '@/lib/db'
import { deleteFile, uploadFile } from '@/lib/r2'
import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { withServerErrorCapture } from '@/lib/error-handler'

const editRecipeSchema = z.object({
  ...recipeSchema.shape,
  id: z.coerce.number(),
  image: z.instanceof(File, { message: "L'image est requise" }).optional(),
})

type EditRecipeFormValues = z.infer<typeof editRecipeSchema>
type EditRecipeFormInput = Partial<z.input<typeof editRecipeSchema>>

const editRecipe = createServerFn({
  method: 'POST',
})
  .validator((formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries())

    if (typeof rawData.ingredientsSections !== 'string') {
      throw new TypeError('Invalid input format')
    }
    rawData.ingredientsSections = JSON.parse(rawData.ingredientsSections)
    return editRecipeSchema.parse(rawData)
  })
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const { image, ingredientsSections, name, steps, id } = data

      const currentRecipe = await getDb().recipe.findFirst({
        where: {
          id,
        },
      })

      if (!currentRecipe) {
        throw notFound()
      }

      let imageKey = currentRecipe.image

      if (image) {
        await deleteFile(imageKey)
        imageKey = await uploadFile(image)
      }

      await Promise.all([
        getDb().recipe.update({
          where: {
            id,
          },
          data: {
            name,
            image: imageKey,
            steps,
          },
        }),
        getDb().recipeIngredientsSection.deleteMany({
          where: {
            recipeId: id,
          },
        }),
      ])

      await Promise.all(
        ingredientsSections.map(async (section, index) => {
          if ('recipeId' in section) {
            await getDb().recipeIngredientsSection.create({
              data: {
                recipeId: currentRecipe.id,
                subRecipeId: section.recipeId,
                name: section.name,
                ratio: section.ratio,
              },
            })
          } else if ('ingredients' in section) {
            const updatedSection = await getDb().recipeIngredientsSection.create({
              data: {
                recipeId: currentRecipe.id,
                name: section.name,
                isDefault: index === 0,
              },
            })

            if (section.ingredients.length > 0) {
              await getDb().sectionIngredient.createMany({
                data: section.ingredients.map((ingredient) => ({
                  sectionId: updatedSection.id,
                  ingredientId: ingredient.id,
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                })),
              })
            }
          }
        })
      )
    })
  )
const editRecipeMutationQueryOptions = mutationOptions({
  mutationFn: editRecipe,
})

export {
  editRecipeMutationQueryOptions,
  editRecipeSchema,
  type EditRecipeFormInput,
  type EditRecipeFormValues,
}
