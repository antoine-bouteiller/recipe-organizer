import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile } from '@/lib/r2'
import { extractLinkedRecipeIds } from '@/lib/utils/circular-reference'
import { parseFormData } from '@/utils/form-data'

const fileSchema = z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })], {
  message: "L'image est requise",
})

const recipeSchema = z.object({
  image: fileSchema,
  ingredientGroups: z.array(
    z.object({
      groupName: z.string().optional(),
      ingredients: z
        .array(
          z.object({
            id: z.coerce.number().positive({ message: "L'ingrédient est requis" }),
            quantity: z.coerce.number().positive({ message: 'La quantité est requise' }),
            unitId: z.coerce.number().positive().optional(),
          })
        )
        .min(1, { message: 'Au moins un ingrédient est requis' }),
    })
  ),
  instructions: z.string(),
  isSubrecipe: z.boolean().default(false),
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  servings: z.coerce.number().positive({ message: 'Le nombre de portions est requis' }),
})

type RecipeFormValues = z.infer<typeof recipeSchema>
type RecipeFormInput = Partial<z.input<typeof recipeSchema>>
export type RecipeIngredientGroupFormInput = NonNullable<RecipeFormInput['ingredientGroups']>[number]

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))
  .handler(async ({ data }) => {
    const { image, ingredientGroups, instructions, isSubrecipe, name, servings } = data
    const imageKey = image instanceof File ? await uploadFile(image) : image.id

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
        image: imageKey,
        instructions,
        isSubrecipe,
        name,
        servings,
      })
      .returning({ id: recipe.id })

    await Promise.all(
      ingredientGroups.map(async (group, index) => {
        const [createdGroup] = await getDb()
          .insert(recipeIngredientGroup)
          .values({
            groupName: group.groupName,
            isDefault: index === 0,
            recipeId: createdRecipe.id,
          })
          .returning()

        if (group.ingredients.length > 0) {
          await getDb()
            .insert(groupIngredient)
            .values(
              group.ingredients.map((ingredient) => ({
                groupId: createdGroup.id,
                ingredientId: ingredient.id,
                quantity: ingredient.quantity,
                unitId: ingredient.unitId ?? undefined,
              }))
            )
        }
      })
    )

    const linkedRecipes = extractLinkedRecipeIds(instructions)
    if (linkedRecipes.length > 0) {
      await getDb()
        .insert(recipeLinkedRecipes)
        .values(
          linkedRecipes.map(({ position, recipeId: linkedRecipeId }) => ({
            linkedRecipeId,
            position,
            recipeId: createdRecipe.id,
          }))
        )
    }
  })

const createRecipeOptions = () =>
  mutationOptions({
    mutationFn: createRecipe,
    onError: (error, variables, _context) => {
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastError(`Erreur lors de la création de la recette ${title}`, error)
    },
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
  })

export { createRecipeOptions, recipeSchema, type RecipeFormInput, type RecipeFormValues }
