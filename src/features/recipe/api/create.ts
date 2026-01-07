import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile } from '@/lib/r2'
import { parseFormData } from '@/utils/form-data'

import { getTitle } from '../utils/get-recipe-title'

const recipeSchema = type({
  image: type('File').or({
    id: 'string',
    url: 'string',
  }),
  ingredientGroups: type({
    'groupName?': 'string',
    ingredients: type({
      id: 'number>0',
      quantity: 'number>0',
      'unitId?': 'number>0 | undefined',
    }).array(),
  }).array(),
  instructions: 'string',
  'linkedRecipes?': type({
    id: 'number>0',
    ratio: 'number>0',
  }).array(),
  name: 'string>=2',
  servings: 'number>0',
})

type RecipeFormValues = typeof recipeSchema.infer
type RecipeFormInput = Partial<RecipeFormValues>
export type RecipeIngredientGroupFormInput = NonNullable<RecipeFormInput['ingredientGroups']>[number]

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => recipeSchema.assert(parseFormData(formData)))
  .handler(async ({ data }) => {
    const { image, ingredientGroups, instructions, linkedRecipes, name, servings } = data
    const imageKey = image instanceof File ? await uploadFile(image) : image.id

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
        image: imageKey,
        instructions,
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

    if (linkedRecipes && linkedRecipes.length > 0) {
      await getDb()
        .insert(recipeLinkedRecipes)
        .values(
          linkedRecipes.map((lr) => ({
            linkedRecipeId: lr.id,
            ratio: lr.ratio,
            recipeId: createdRecipe.id,
          }))
        )
    }
  })

const createRecipeOptions = () =>
  mutationOptions({
    mutationFn: createRecipe,
    onError: (error, variables, _context) => {
      toastError(`Erreur lors de la création de la recette ${getTitle(variables.data)}`, error)
    },
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({
        queryKey: queryKeys.recipeLists(),
      })
      toastManager.add({
        title: `Recette ${getTitle(variables.data)} créée`,
        type: 'success',
      })
    },
  })

export { createRecipeOptions, recipeSchema, type RecipeFormInput, type RecipeFormValues }
