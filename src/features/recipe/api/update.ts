import { mutationOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq, inArray } from 'drizzle-orm'
import { z } from 'zod'

import { toastError, toastManager } from '@/components/ui/toast'
import { authGuard } from '@/features/auth/lib/auth-guard'
import { recipeSchema } from '@/features/recipe/api/create'
import { getDb } from '@/lib/db'
import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { deleteFile, uploadFile } from '@/lib/r2'
import { extractLinkedRecipeIds } from '@/lib/utils/circular-reference'
import { withServerErrorCapture } from '@/utils/error-handler'
import { parseFormData } from '@/utils/form-data'

const updateRecipeSchema = z.object({
  ...recipeSchema.shape,
  id: z.coerce.number(),
})

type UpdateRecipeFormValues = z.infer<typeof updateRecipeSchema>
type UpdateRecipeFormInput = Partial<z.input<typeof updateRecipeSchema>>

const updateRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => updateRecipeSchema.parse(parseFormData(formData)))
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const { id, image, ingredientGroups, instructions, isSubrecipe, name, servings } = data

      const currentRecipe = await getDb().query.recipe.findFirst({
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

      let imageKey = currentRecipe.image

      if (image instanceof File) {
        await deleteFile(imageKey)
        imageKey = await uploadFile(image)
      }

      await getDb().batch([
        getDb()
          .update(recipe)
          .set({
            image: imageKey,
            instructions,
            isSubrecipe,
            name,
            servings,
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

      const linkedRecipes = extractLinkedRecipeIds(instructions)
      if (linkedRecipes.length > 0) {
        await getDb()
          .insert(recipeLinkedRecipes)
          .values(
            linkedRecipes.map(({ position, recipeId: linkedRecipeId }) => ({
              linkedRecipeId,
              position,
              recipeId: id,
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
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastError(`Erreur lors de la mise à jour de la recette ${title}`, error)
    },
    onSuccess: (_data, variables, _result, context) => {
      void context.client.invalidateQueries({
        queryKey: queryKeys.allRecipes,
      })
      const { data: title } = z.string().safeParse(variables.data.get('name'))
      toastManager.add({
        title: `Recette ${title} mise à jour`,
        type: 'success',
      })
    },
  })

export { updateRecipeOptions, updateRecipeSchema, type UpdateRecipeFormInput, type UpdateRecipeFormValues }
