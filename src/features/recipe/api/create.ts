import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { inArray } from 'drizzle-orm'
import { z } from 'zod'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { groupIngredient, ingredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile, uploadVideo } from '@/lib/r2'
import { toastError } from '@/lib/toast-helpers'
import { isNotEmpty } from '@/utils/array'
import { parseFormData } from '@/utils/form-data'

import { RECIPE_TAGS, type RecipeTag } from '../utils/constants'
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
          unitId: z.number().min(0).optional(),
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

    const hasIngredients = allIngredientIds.length > 0
    const hasLinkedRecipes = linkedRecipeIds.length > 0

    let ownIngredientsVegetarian = true
    let linkedRecipesVegetarian = true

    if (hasIngredients && hasLinkedRecipes) {
      const [ingredientCategories, linkedRecipesData] = await getDb().batch([
        getDb().select({ category: ingredient.category }).from(ingredient).where(inArray(ingredient.id, allIngredientIds)),
        getDb().select({ tags: recipe.tags }).from(recipe).where(inArray(recipe.id, linkedRecipeIds)),
      ])
      ownIngredientsVegetarian = ingredientCategories.every(
        (ingredientItem) => ingredientItem.category !== 'meat' && ingredientItem.category !== 'fish'
      )
      linkedRecipesVegetarian = linkedRecipesData.every((recipeItem) => recipeItem.tags?.includes('vegetarian'))
    } else if (hasIngredients) {
      const ingredientCategories = await getDb()
        .select({ category: ingredient.category })
        .from(ingredient)
        .where(inArray(ingredient.id, allIngredientIds))
      ownIngredientsVegetarian = ingredientCategories.every(
        (ingredientItem) => ingredientItem.category !== 'meat' && ingredientItem.category !== 'fish'
      )
    } else if (hasLinkedRecipes) {
      const linkedRecipesData = await getDb().select({ tags: recipe.tags }).from(recipe).where(inArray(recipe.id, linkedRecipeIds))
      linkedRecipesVegetarian = linkedRecipesData.every((recipeItem) => recipeItem.tags?.includes('vegetarian'))
    }

    const isVegetarian = ownIngredientsVegetarian && linkedRecipesVegetarian
    const isMagimix = instructions.includes('"types":"magimixProgram"')

    const autoTags: RecipeTag[] = []
    if (isVegetarian && !tags.includes('dessert')) {
      autoTags.push('vegetarian')
    }
    if (isMagimix) {
      autoTags.push('magimix')
    }

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
              group.ingredients.map((ingredientEntry) => ({
                groupId: createdGroup.id,
                ingredientId: ingredientEntry.id,
                quantity: ingredientEntry.quantity,
                unitId: ingredientEntry.unitId ?? undefined,
              }))
            )
        }
      })
    )

    if (isNotEmpty(linkedRecipes)) {
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

export { createRecipeOptions, recipeSchema, type RecipeFormInput }
