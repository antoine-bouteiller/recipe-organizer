import { getDb } from '@/lib/db'
import { recipe, recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema'
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
export type RecipeSectionFormInput = NonNullable<RecipeFormInput['sections']>[number]

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
  .handler(async ({ data }) => {
    const { image, sections, name, steps } = data
    const imageKey = await uploadFile(image)

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
        name,
        image: imageKey,
        steps,
      })
      .returning({ id: recipe.id })

    await Promise.all(
      sections.map(async (section, index) => {
        if ('recipeId' in section) {
          await getDb().insert(recipeIngredientsSection).values({
            recipeId: createdRecipe.id,
            subRecipeId: section.recipeId,
            name: section.name,
            ratio: section.ratio,
          })
        } else if ('ingredients' in section) {
          const [createdSection] = await getDb()
            .insert(recipeIngredientsSection)
            .values({
              recipeId: createdRecipe.id,
              name: section.name,
              isDefault: index === 0,
            })
            .returning()

          if (section.ingredients.length > 0) {
            await getDb()
              .insert(sectionIngredient)
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
