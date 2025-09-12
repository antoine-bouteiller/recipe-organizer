import { getDb } from '@/lib/db'
import { uploadFile } from '@/lib/r2'
import { withServerErrorCapture } from '@/lib/error-handler'
import { units } from '@/types/units'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const recipeSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  steps: z.string(),
  ingredientsSections: z.array(
    z.union([
      z.object({
        name: z.string().optional(),
        ingredients: z
          .array(
            z.object({
              id: z.coerce.number().positive({ message: "L'ingrédient est requis" }),
              quantity: z.coerce.number().positive({ message: 'La quantité est requise' }),
              unit: z.enum(units).optional(),
            })
          )
          .min(1, { message: 'Au moins un ingrédient est requis' }),
      }),
      z.object({
        name: z.string().optional(),
        recipeId: z.coerce.number().positive({ message: 'La recette est requise' }),
        ratio: z.number().positive({ message: 'Le ratio est requis' }),
      }),
    ])
  ),
  image: z.instanceof(File, { message: "L'image est requise" }),
})

type RecipeFormValues = z.infer<typeof recipeSchema>
type RecipeFormInput = Partial<z.input<typeof recipeSchema>>
export type RecipeSectionFormInput = NonNullable<RecipeFormInput['ingredientsSections']>[number]

const createRecipe = createServerFn({
  method: 'POST',
})
  .validator((formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries())
    if (typeof rawData.sections !== 'string') {
      throw new TypeError('Invalid input format')
    }
    rawData.sections = JSON.parse(rawData.sections)
    return recipeSchema.parse(rawData)
  })
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const { image, ingredientsSections: sections, name, steps } = data
      const imageKey = await uploadFile(image)

      const createdRecipe = await getDb().recipe.create({
        data: {
          name,
          image: imageKey,
          steps,
        },
      })

      await Promise.all(
        sections.map(async (section, index) => {
          if ('recipeId' in section) {
            await getDb().recipeIngredientsSection.create({
              data: {
                recipeId: createdRecipe.id,
                subRecipeId: section.recipeId,
                name: section.name,
                ratio: section.ratio,
              },
            })
          } else if ('ingredients' in section) {
            const updatedSection = await getDb().recipeIngredientsSection.create({
              data: {
                recipeId: createdRecipe.id,
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

const createRecipeMutationQueryOptions = mutationOptions({
  mutationFn: createRecipe,
})

export {
  createRecipeMutationQueryOptions,
  recipeSchema,
  type RecipeFormInput,
  type RecipeFormValues,
}
