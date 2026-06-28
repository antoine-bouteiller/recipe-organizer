import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { unitSlugSchema } from '@/lib/db/schema/unit'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile, uploadVideo } from '@/lib/r2'
import { toastError } from '@/lib/toast-helpers'
import { parseFormData } from '@/utils/form-data'

import { CUISINE_TYPES, MEALS } from '../utils/constants'
import { getTitle } from '../utils/get-recipe-title'
import { resolveAutoFlags, writeRecipeIngredientGraph } from '../utils/recipe-write'

const recipeSchema = v.object({
  cuisineTypes: v.array(v.picklist(CUISINE_TYPES)),
  image: v.union([v.instance(File), v.object({ id: v.string(), url: v.string() })]),
  ingredientGroups: v.array(
    v.object({
      _key: v.string(),
      groupName: v.optional(v.string()),
      ingredients: v.array(
        v.object({
          _key: v.string(),
          id: v.pipe(v.number(), v.minValue(0)),
          quantity: v.pipe(v.number(), v.minValue(0)),
          unitSlug: v.optional(unitSlugSchema),
        })
      ),
    })
  ),
  instructions: v.string(),
  linkedRecipes: v.optional(
    v.array(
      v.object({
        _key: v.optional(v.string()),
        id: v.pipe(v.number(), v.minValue(0)),
        ratio: v.pipe(v.number(), v.minValue(0)),
      })
    )
  ),
  meals: v.array(v.picklist(MEALS)),
  name: v.pipe(v.string(), v.minLength(2)),
  servings: v.pipe(v.number(), v.minValue(0)),
  video: v.optional(v.union([v.instance(File), v.object({ id: v.string(), url: v.string() })])),
})

type RecipeFormValues = v.InferOutput<typeof recipeSchema>
type RecipeFormInput = Partial<RecipeFormValues>

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .validator((formData: FormData) => v.parse(recipeSchema, parseFormData(formData)))
  .handler(async ({ data, context }) => {
    const { cuisineTypes, image, ingredientGroups, instructions, linkedRecipes, meals, name, servings, video } = data
    const imageKey = image instanceof File ? await uploadFile(image) : image.id
    const videoKey = video instanceof File ? await uploadVideo(video) : video?.id

    const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((ingredientItem) => ingredientItem.id))
    const linkedRecipeIds = linkedRecipes?.map((lr) => lr.id) ?? []

    const { isMagimix, isSpice, isVegetarian } = await resolveAutoFlags({ allIngredientIds, instructions, linkedRecipeIds, meals })

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
        createdBy: context.user.id,
        cuisineTypes,
        image: imageKey,
        instructions,
        isMagimix,
        isSpice,
        isVegetarian,
        meals,
        name,
        servings,
        video: videoKey,
      })
      .returning({ id: recipe.id })

    await writeRecipeIngredientGraph(createdRecipe.id, ingredientGroups, linkedRecipes)
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

export { createRecipeOptions, recipeSchema, type RecipeFormInput }
