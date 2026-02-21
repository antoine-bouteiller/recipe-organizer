import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { inArray } from 'drizzle-orm'
import * as v from 'valibot'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { groupIngredient, ingredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { uploadFile, uploadVideo } from '@/lib/r2'
import { isNotEmpty } from '@/utils/array'
import { parseFormData } from '@/utils/form-data'

import { AUTO_TAGS, RECIPE_TAGS } from '../utils/constants'
import { getTitle } from '../utils/get-recipe-title'

const MANUAL_TAGS = RECIPE_TAGS.filter((tag) => !AUTO_TAGS.includes(tag as (typeof AUTO_TAGS)[number]))

const recipeSchema = v.object({
  image: v.union([v.instance(File), v.object({ id: v.string(), url: v.string() })]),
  ingredientGroups: v.array(
    v.object({
      _key: v.string(),
      groupName: v.optional(v.string()),
      ingredients: v.array(
        v.object({
          id: v.pipe(v.number(), v.minValue(0)),
          quantity: v.pipe(v.number(), v.minValue(0)),
          unitId: v.optional(v.pipe(v.number(), v.minValue(0))),
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
  name: v.pipe(v.string(), v.minLength(2)),
  servings: v.pipe(v.number(), v.minValue(0)),
  tags: v.array(v.picklist(MANUAL_TAGS)),
  video: v.optional(v.union([v.instance(File), v.object({ id: v.string(), url: v.string() })])),
})

type RecipeFormValues = v.InferOutput<typeof recipeSchema>
type RecipeFormInput = Partial<RecipeFormValues>

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => v.parse(recipeSchema, parseFormData(formData)))
  .handler(async ({ data }) => {
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
    const isMagimix = instructions.includes('data-type="magimix-program"')

    const autoTags: string[] = []
    if (isVegetarian && !tags.includes('dessert')) {
      autoTags.push('vegetarian')
    }
    if (isMagimix) {
      autoTags.push('magimix')
    }

    const [createdRecipe] = await getDb()
      .insert(recipe)
      .values({
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
