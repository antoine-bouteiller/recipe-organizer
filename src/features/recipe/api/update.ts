import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq, inArray } from 'drizzle-orm'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { recipeSchema } from '@/features/recipe/api/create'
import { getDb } from '@/lib/db'
import { groupIngredient, ingredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { deleteFile, uploadFile, uploadVideo } from '@/lib/r2'
import { isNotEmpty } from '@/utils/array'
import { withServerError } from '@/utils/error-handler'
import { parseFormData } from '@/utils/form-data'

import { getTitle } from '../utils/get-recipe-title'

const updateRecipeSchema = recipeSchema.merge({
  id: 'number',
})

type UpdateRecipeFormValues = typeof updateRecipeSchema.infer
type UpdateRecipeFormInput = Partial<UpdateRecipeFormValues>

const updateRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => updateRecipeSchema.assert(parseFormData(formData)))
  .handler(
    withServerError(async ({ data }) => {
      const { id, image, ingredientGroups, instructions, linkedRecipes, name, servings, video } = data

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

      let imageKey = currentRecipe.image

      if (image instanceof File) {
        await deleteFile(imageKey)
        imageKey = await uploadFile(image)
      }

      let videoKey = currentRecipe.video

      if (video instanceof File) {
        if (videoKey) {
          await deleteFile(videoKey)
        }
        videoKey = await uploadVideo(video)
      } else if (video !== undefined) {
        videoKey = video?.id
      }

      const allIngredientIds = ingredientGroups.flatMap((group) => group.ingredients.map((i) => i.id))
      const linkedRecipeIds = linkedRecipes?.map((lr) => lr.id) ?? []

      const [ingredientCategories, linkedRecipesData] = await getDb().batch([
        getDb().select({ category: ingredient.category }).from(ingredient).where(inArray(ingredient.id, allIngredientIds)),
        getDb().select({ isVegetarian: recipe.isVegetarian }).from(recipe).where(inArray(recipe.id, linkedRecipeIds)),
      ])

      await getDb().batch([
        getDb()
          .update(recipe)
          .set({
            image: imageKey,
            instructions,
            isVegetarian:
              ingredientCategories.every((ingredient) => ingredient.category !== 'meat' && ingredient.category !== 'fish') &&
              linkedRecipesData.every((linkedRecipe) => linkedRecipe.isVegetarian),
            isMagimix: instructions.includes('data-type="magimix-program"'),
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
              currentRecipe.ingredientGroups.map(({ id }) => id)
            )
          ),
        getDb().delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
        getDb().delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
      ])

      await Promise.all(
        ingredientGroups.map(async (group, index) => {
          const [updatedGroup] = await getDb()
            .insert(recipeIngredientGroup)
            .values({
              groupName: group.groupName,
              isDefault: index === 0,
              recipeId: currentRecipe.id,
            })
            .returning()

          if (group.ingredients.length > 0) {
            await getDb()
              .insert(groupIngredient)
              .values(
                group.ingredients.map((ingredient) => ({
                  groupId: updatedGroup.id,
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

export { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput, type UpdateRecipeFormValues }
