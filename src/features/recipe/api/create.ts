import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { recipe, recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile } from '@/lib/r2'
import { parseFormData } from '@/utils/form-data'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const fileSchema = z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })], {
  message: "L'image est requise",
})

const recipeSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  steps: z.string(),
  quantity: z.coerce.number().positive({ message: 'La quantité est requise' }),
  sections: z.array(
    z.union([
      z.object({
        name: z.string().optional(),
        ingredients: z
          .array(
            z.object({
              id: z.coerce.number().positive({ message: "L'ingrédient est requis" }),
              quantity: z.coerce.number().positive({ message: 'La quantité est requise' }),
              unitId: z.coerce.number().positive().optional(),
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
  image: fileSchema,
})

type RecipeFormValues = z.infer<typeof recipeSchema>
type RecipeFormInput = Partial<z.input<typeof recipeSchema>>
export type RecipeSectionFormInput = NonNullable<RecipeFormInput['sections']>[number]

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))
  .handler(async ({ data }) => {
    const { image, sections, name, steps, quantity } = data
    const imageKey = image instanceof File ? await uploadFile(image) : image.id

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
        name,
        image: imageKey,
        steps,
        quantity,
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
                  unitId: ingredient.unitId ?? undefined,
                }))
              )
          }
        }
      })
    )
  })

const createRecipeOptions = () =>
  mutationOptions({
    mutationFn: createRecipe,
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({
        queryKey: queryKeys.recipeLists(),
      })
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastManager.add({
        title: `Recette ${title} créée`,
        type: 'success',
      })
    },
    onError: (error, variables, _context) => {
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastError(`Erreur lors de la création de la recette ${title}`, error)
    },
  })

export { createRecipeOptions, recipeSchema, type RecipeFormInput, type RecipeFormValues }
