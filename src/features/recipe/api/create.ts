import { getDb } from '@/lib/db'
import { recipes, recipeSections, sectionIngredients } from '@/lib/db/schema'
import { uploadFile } from '@/lib/r2'
import { units } from '@/types/units'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const recipeSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  steps: z.string(),
  sections: z.array(
    z.union([
      z.object({
        name: z.string().optional(),
        ingredients: z.array(
          z.object({
            id: z.coerce.number().min(1, { message: "L'ingrédient est requis" }),
            quantity: z.number().positive({ message: 'La quantité est requise' }),
            unit: z.enum(units).optional(),
          })
        ),
      }),
      z.object({
        name: z.string().optional(),
        recipeId: z.coerce.number().optional(),
        ratio: z.number().positive({ message: 'Le ratio est requis' }),
      }),
    ])
  ),
  image: z.instanceof(File, { message: "L'image est requise" }),
})

type RecipeFormValues = z.infer<typeof recipeSchema>
type RecipeFormInput = z.input<typeof recipeSchema>

const createRecipe = createServerFn({
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

    const [createdRecipe] = await getDb()
      .insert(recipes)
      .values({
        name,
        image: imageKey,
        steps,
      })
      .returning({ id: recipes.id })

    await Promise.all(
      sections.map(async (section, index) => {
        if ('recipeId' in section) {
          await getDb().insert(recipeSections).values({
            recipeId: createdRecipe.id,
            subRecipeId: section.recipeId,
            name: section.name,
            ratio: section.ratio,
          })
        } else if ('ingredients' in section) {
          const [createdSection] = await getDb()
            .insert(recipeSections)
            .values({
              recipeId: createdRecipe.id,
              name: section.name,
              isDefault: index === 0,
            })
            .returning()

          if (section.ingredients.length > 0) {
            await getDb()
              .insert(sectionIngredients)
              .values(
                section.ingredients.map((ingredient) => ({
                  sectionId: createdSection.id,
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

export { recipeSchema, createRecipe, type RecipeFormValues, type RecipeFormInput }
