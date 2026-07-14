import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/solid-router'
import { createServerFn } from '@tanstack/solid-start'
import { eq, inArray } from 'drizzle-orm'
import * as v from 'valibot'

import { toastManager } from '@/components/ui/toast'
import { recipeSchema } from '@/features/recipe/api/create'
import { authGuard } from '@/lib/auth/auth-guard'
import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { deleteFile, uploadFile, uploadVideo } from '@/lib/r2'
import { toastError } from '@/lib/toast-helpers'
import { assertOwnerOrAdmin } from '@/utils/assert-owner-or-admin'
import { withServerError } from '@/utils/error-handler'
import { parseFormData } from '@/utils/form-data'

import { getTitle } from '../utils/get-recipe-title'
import { resolveAutoFlags, writeRecipeIngredientGraph } from '../utils/recipe-write.server'

const updateRecipeSchema = v.object({ ...recipeSchema.entries, id: v.number() })

type UpdateRecipeFormValues = v.InferOutput<typeof updateRecipeSchema>
type UpdateRecipeFormInput = Partial<UpdateRecipeFormValues>

const resolveImageKey = async (image: UpdateRecipeFormValues['image'], currentKey: string | null): Promise<string> => {
  if (image instanceof File) {
    if (currentKey) {
      await deleteFile(currentKey)
    }
    return uploadFile(image)
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

const updateRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .validator((formData: FormData) => v.parse(updateRecipeSchema, parseFormData(formData)))
  .handler(
    withServerError(async ({ data, context }) => {
      const { cuisineTypes, id, image, ingredientGroups, instructions, linkedRecipes, meals, name, servings, video } = data

      const currentRecipe = await getDb().query.recipe.findFirst({
        where: { id },
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

      assertOwnerOrAdmin(context.user, currentRecipe)

      const imageKey = await resolveImageKey(image, currentRecipe.image)
      const videoKey = await resolveVideoKey(video, currentRecipe.video)

      const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((ingredientItem) => ingredientItem.id))
      const linkedRecipeIds = linkedRecipes?.map((lr) => lr.id) ?? []

      const { isMagimix, isSpice, isVegetarian } = await resolveAutoFlags({ allIngredientIds, instructions, linkedRecipeIds, meals })

      await getDb().batch([
        getDb()
          .update(recipe)
          .set({
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
          .where(eq(recipe.id, id))
          .returning({ id: recipe.id }),
        getDb()
          .delete(groupIngredient)
          .where(
            inArray(
              groupIngredient.groupId,
              currentRecipe.ingredientGroups.map(({ id: ingredientGroupId }) => ingredientGroupId)
            )
          ),
        getDb().delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
        getDb().delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
      ])

      await writeRecipeIngredientGraph(currentRecipe.id, ingredientGroups, linkedRecipes)

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
