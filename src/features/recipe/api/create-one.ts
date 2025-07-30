import { getDb } from '@/lib/db'
import { recipes, recipeSections, sectionIngredients, units } from '@/lib/db/schema'
import { uploadFile } from '@/lib/s3.server'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const recipeSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  steps: z.string(),
  sections: z.array(
    z.object({
      name: z.string().optional(),
      ingredients: z.array(
        z.object({
          id: z.coerce.number().min(1, { message: "L'ingrédient est requis" }),
          quantity: z.number().min(1, { message: 'La quantité est requise' }),
          unit: z.enum(units.enumValues).optional(),
        })
      ),
    })
  ),
  image: z.instanceof(File, { message: "L'image est requise" }),
})

export const createRecipe = createServerFn({
  method: 'POST',
})
  .validator((formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries())
    rawData.sections = JSON.parse(rawData.sections as string)
    return recipeSchema.parse(rawData)
  })
  .handler(async ({ data }) => {
    const { image, sections, name, steps } = data
    const imageKey = await uploadFile(image)

    await getDb().transaction(async (tx) => {
      const [createdRecipe] = await tx
        .insert(recipes)
        .values({
          name,
          image: imageKey,
          steps,
        })
        .returning()

      await Promise.all(
        sections.map(async (section) => {
          const [createdSection] = await tx
            .insert(recipeSections)
            .values({
              recipeId: createdRecipe.id,
              name: section.name,
            })
            .returning()

          if (section.ingredients.length > 0) {
            await tx.insert(sectionIngredients).values(
              section.ingredients.map((ingredient) => ({
                sectionId: createdSection.id,
                ingredientId: ingredient.id,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
              }))
            )
          }
        })
      )
    })
  })
