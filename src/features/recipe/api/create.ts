import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { unitSlugSchema } from '@/lib/db/schema/unit'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile, uploadVideo } from '@/lib/r2'
import { toastError } from '@/lib/toast-helpers'
import { parseFormData } from '@/utils/form-data'

import { resolveAutoTags, writeRecipeIngredientGraph } from '../lib/recipe-write'
import { RECIPE_TAGS } from '../utils/constants'
import { getTitle } from '../utils/get-recipe-title'

const recipeSchema = z.object({
  image: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]),
  ingredientGroups: z.array(
    z.object({
      _key: z.string(),
      groupName: z.string().optional(),
      ingredients: z.array(
        z.object({
          _key: z.string(),
          id: z.number().min(0),
          quantity: z.number().min(0),
          unitSlug: unitSlugSchema.optional(),
        })
      ),
    })
  ),
  instructions: z.string(),
  linkedRecipes: z
    .array(
      z.object({
        _key: z.string().optional(),
        id: z.number().min(0),
        ratio: z.number().min(0),
      })
    )
    .optional(),
  name: z.string().min(2),
  servings: z.number().min(0),
  tags: z.array(z.enum(RECIPE_TAGS)),
  video: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]).optional(),
})

type RecipeFormValues = z.infer<typeof recipeSchema>
type RecipeFormInput = Partial<RecipeFormValues>

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))
  .handler(async ({ data, context }) => {
    const { image, ingredientGroups, instructions, linkedRecipes, name, servings, tags, video } = data
    const imageKey = image instanceof File ? await uploadFile(image) : image.id
    const videoKey = video instanceof File ? await uploadVideo(video) : video?.id

    const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((ingredientItem) => ingredientItem.id))
    const linkedRecipeIds = linkedRecipes?.map((lr) => lr.id) ?? []

    const autoTags = await resolveAutoTags({ allIngredientIds, instructions, linkedRecipeIds, tags })

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
        createdBy: context.user.id,
        image: imageKey,
        instructions,
        name,
        servings,
        tags: [...tags, ...autoTags],
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
