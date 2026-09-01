import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq, inArray } from 'drizzle-orm'
import * as z from 'zod'

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

const updateRecipeSchema = recipeSchema.extend({ id: z.number() })

type UpdateRecipeFormValues = z.infer<typeof updateRecipeSchema>
type UpdateRecipeFormInput = Partial<UpdateRecipeFormValues>

const resolveImageKey = async (
  image: UpdateRecipeFormValues['image'],
  currentKey: string | null
): Promise<{ key: string; staleKey: string | null }> => {
  if (image instanceof File) {
    return { key: await uploadFile(image), staleKey: currentKey }
  }
  return { key: currentKey ?? '', staleKey: null }
}

const resolveVideoKey = async (
  video: UpdateRecipeFormValues['video'],
  currentKey: string | null | undefined
): Promise<{ key: string | null | undefined; staleKey: string | null }> => {
  if (video instanceof File) {
    return { key: await uploadVideo(video), staleKey: currentKey ?? null }
  }
  if (video === undefined) {
    return { key: currentKey, staleKey: null }
  }
  return { key: video?.id, staleKey: null }
}

const updateRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .validator((formData: FormData) => updateRecipeSchema.parse(parseFormData(formData)))
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

      const { key: imageKey, staleKey: imageStale } = await resolveImageKey(image, currentRecipe.image)
      const { key: videoKey, staleKey: videoStale } = await resolveVideoKey(video, currentRecipe.video)

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

      // Best-effort: an undeleted stale blob is preferable to failing a successful update.
      await Promise.allSettled([imageStale, videoStale].filter((key): key is string => Boolean(key)).map((key) => deleteFile(key)))

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
