import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'
import { inArray } from 'drizzle-orm'

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
  tags: type.enumerated(...MANUAL_TAGS).array(),
  'video?': type('File')
    .or({
      id: 'string',
      url: 'string',
    })
    .or('undefined'),
})

type RecipeFormValues = typeof recipeSchema.infer
type RecipeFormInput = Partial<RecipeFormValues>

const createRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => recipeSchema.assert(parseFormData(formData)))
  .handler(async ({ data }) => {
    const { image, ingredientGroups, instructions, linkedRecipes, name, servings, tags, video } = data
    const imageKey = image instanceof File ? await uploadFile(image) : image.id
    const videoKey = video instanceof File ? await uploadVideo(video) : video?.id

    const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((i) => i.id))
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
      ownIngredientsVegetarian = ingredientCategories.every((i) => i.category !== 'meat' && i.category !== 'fish')
      linkedRecipesVegetarian = linkedRecipesData.every((r) => r.tags?.includes('vegetarian'))
    } else if (hasIngredients) {
      const ingredientCategories = await getDb()
        .select({ category: ingredient.category })
        .from(ingredient)
        .where(inArray(ingredient.id, allIngredientIds))
      ownIngredientsVegetarian = ingredientCategories.every((i) => i.category !== 'meat' && i.category !== 'fish')
    } else if (hasLinkedRecipes) {
      const linkedRecipesData = await getDb().select({ tags: recipe.tags }).from(recipe).where(inArray(recipe.id, linkedRecipeIds))
      linkedRecipesVegetarian = linkedRecipesData.every((r) => r.tags?.includes('vegetarian'))
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
