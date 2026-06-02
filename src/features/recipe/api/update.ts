import { groupIngredient, ingredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db, eq, inArray } from 'void/db'

import { toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { recipeSchema } from '@/features/recipe/api/create'
import { queryKeys } from '@/lib/query-keys'
import { toastError } from '@/lib/toast-helpers'
import { isNotEmpty } from '@/utils/array'
import { withServerError } from '@/utils/error-handler'
import { parseFormData } from '@/utils/form-data'

import { type RecipeTag } from '../utils/constants'
import { getTitle } from '../utils/get-recipe-title'
import { deleteFile, uploadImage, uploadVideo } from '../utils/storage'

const updateRecipeSchema = v.object({ ...recipeSchema.entries, id: v.number() })

type UpdateRecipeFormValues = v.InferOutput<typeof updateRecipeSchema>
type UpdateRecipeFormInput = Partial<UpdateRecipeFormValues>

const resolveImageKey = async (image: UpdateRecipeFormValues['image'], currentKey: string | null): Promise<string> => {
  if (image instanceof File) {
    if (currentKey) {
      await deleteFile(currentKey)
    }
    return uploadImage(image)
  }
  return currentKey ?? ''
}

const resolveVideoKey = async (video: UpdateRecipeFormValues['video'], currentKey: string | null | undefined): Promise<string | null | undefined> => {
  if (video instanceof File) {
    if (currentKey) {
      await deleteFile(currentKey)
    }
    return uploadVideo(video)
  }
  if (video === undefined) {
    return currentKey
  }
  return video?.id
}

const computeAutoTags = (
  ingredientCategories: { category: string | null }[],
  linkedRecipesData: { tags: string[] | null }[],
  instructions: string,
  tags: string[]
): RecipeTag[] => {
  const ownVegetarian = ingredientCategories.every((item) => item.category !== 'meat' && item.category !== 'fish')
  const linkedVegetarian = linkedRecipesData.every((item) => item.tags?.includes('vegetarian'))
  const autoTags: RecipeTag[] = []
  if (ownVegetarian && linkedVegetarian && !tags.includes('dessert')) {
    autoTags.push('vegetarian')
  }
  if (instructions.includes('"type":"magimixProgram"')) {
    autoTags.push('magimix')
  }
  return autoTags
}

const updateRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => v.parse(updateRecipeSchema, parseFormData(formData)))
  .handler(
    withServerError(async ({ data, context }) => {
      const { id, image, ingredientGroups, instructions, linkedRecipes, name, servings, tags, video } = data

      const currentRecipe = await db.query.recipe.findFirst({
        where: eq(recipe.id, id),
        with: {
          ingredientGroups: {
            columns: {
              id: true,
            },
          },
        },
      })

      if (!currentRecipe) {
        throw notFound()
      }

      if (context.user.role !== 'admin' && currentRecipe.createdBy !== context.user.id) {
        throw new Error('Permission denied')
      }

      const imageKey = await resolveImageKey(image, currentRecipe.image)
      const videoKey = await resolveVideoKey(video, currentRecipe.video)

      const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((ingredientItem) => ingredientItem.id))
      const linkedRecipeIds = linkedRecipes?.map((lr) => lr.id) ?? []

      const [ingredientCategories, linkedRecipesData] = await db.batch([
        db.select({ category: ingredient.category }).from(ingredient).where(inArray(ingredient.id, allIngredientIds)),
        db.select({ tags: recipe.tags }).from(recipe).where(inArray(recipe.id, linkedRecipeIds)),
      ])

      const autoTags = computeAutoTags(ingredientCategories, linkedRecipesData, instructions, tags)

      await db.batch([
        db
          .update(recipe)
          .set({
            image: imageKey,
            instructions,
            name,
            servings,
            tags: [...tags, ...autoTags],
            video: videoKey,
          })
          .where(eq(recipe.id, id))
          .returning({ id: recipe.id }),
        db.delete(groupIngredient).where(
          inArray(
            groupIngredient.groupId,
            currentRecipe.ingredientGroups.map(({ id: ingredientGroupId }) => ingredientGroupId)
          )
        ),
        db.delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
        db.delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
      ])

      await Promise.all(
        ingredientGroups.map(async (group, index) => {
          const [updatedGroup] = await db
            .insert(recipeIngredientGroup)
            .values({
              groupName: group.groupName,
              isDefault: index === 0,
              recipeId: currentRecipe.id,
            })
            .returning()

          if (group.ingredients.length > 0) {
            await db.insert(groupIngredient).values(
              group.ingredients.map((ingredientEntry) => ({
                groupId: updatedGroup.id,
                ingredientId: ingredientEntry.id,
                quantity: ingredientEntry.quantity,
                unitSlug: ingredientEntry.unitSlug ?? undefined,
              }))
            )
          }
        })
      )

      if (isNotEmpty(linkedRecipes)) {
        await db.insert(recipeLinkedRecipes).values(
          linkedRecipes.map((lr) => ({
            linkedRecipeId: lr.id,
            ratio: lr.ratio,
            recipeId: currentRecipe.id,
          }))
        )
      }

      return id
    })
  )

const updateRecipeOptions = () =>
  mutationOptions({
    mutationFn: updateRecipe,
    onError: (error, variables) => {
      toastError(`Erreur lors de la mise à jour de la recette ${getTitle(variables.data)}`, error)
    },
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({
        queryKey: queryKeys.allRecipes,
      })
      toastManager.add({
        title: `Recette ${getTitle(variables.data)} mise à jour`,
        type: 'success',
      })
    },
  })

export { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput }
