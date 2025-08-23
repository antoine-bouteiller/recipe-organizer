import { recipeSchema } from '@/features/recipe/api/create'
import { getDb } from '@/lib/db'
import { recipes, recipeSections, sectionIngredients } from '@/lib/db/schema'
import { uploadFile } from '@/lib/r2'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const editRecipeSchema = z.object({
  ...recipeSchema.shape,
  id: z.number(),
})

type EditRecipeFormValues = z.infer<typeof editRecipeSchema>
type EditRecipeFormInput = z.input<typeof editRecipeSchema>

const editRecipe = createServerFn({
  method: 'POST',
})
  .validator((formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries())
    rawData.sections = JSON.parse(rawData.sections as string)
    return editRecipeSchema.parse(rawData)
  })
  .handler(async ({ data }) => {
    const { image, sections, name, steps, id } = data
    const imageKey = await uploadFile(image)

    const [updatedRecipe] = await getDb()
      .update(recipes)
      .set({
        name,
        image: imageKey,
        steps,
      })
      .where(eq(recipes.id, id))
      .returning({ id: recipes.id })

    await Promise.all(
      sections.map(async (section, index) => {
        if ('recipeId' in section) {
          await getDb().insert(recipeSections).values({
            recipeId: updatedRecipe.id,
            subRecipeId: section.recipeId,
            name: section.name,
            ratio: section.ratio,
          })
        } else if ('ingredients' in section) {
          const [updatedSection] = await getDb()
            .insert(recipeSections)
            .values({
              recipeId: updatedRecipe.id,
              name: section.name,
              isDefault: index === 0,
            })
            .returning()

          if (section.ingredients.length > 0) {
            await getDb()
              .insert(sectionIngredients)
              .values(
                section.ingredients.map((ingredient) => ({
                  sectionId: updatedSection.id,
                  ingredientId: ingredient.id,
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                }))
              )
          }
        }
      })
    )
  })

export { editRecipe, editRecipeSchema, type EditRecipeFormInput, type EditRecipeFormValues }
