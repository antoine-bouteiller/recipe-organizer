import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@schema'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db, eq, inArray } from 'void/db'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

import { deleteFile } from '../utils/storage'

const deleteRecipeSchema = v.number()

const deleteRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard()])
  .inputValidator(deleteRecipeSchema)
  .handler(
    withServerError(async ({ data: id, context }) => {
      const currentRecipe = await db.query.recipe.findFirst({
        columns: {
          createdBy: true,
          id: true,
          image: true,
        },
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
        throw new Error('Recipe not found')
      }

      if (context.user.role !== 'admin' && currentRecipe.createdBy !== context.user.id) {
        throw new Error('Permission denied')
      }

      await db.batch([
        db.delete(groupIngredient).where(
          inArray(
            groupIngredient.groupId,
            currentRecipe.ingredientGroups.map(({ id: groupId }) => groupId)
          )
        ),
        db.delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
        db.delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
        db.delete(recipe).where(eq(recipe.id, id)),
      ])
      await deleteFile(currentRecipe.image)
    })
  )

const deleteRecipeOptions = () =>
  mutationOptions({
    mutationFn: deleteRecipe,
    onSuccess: (_data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.allRecipes })
    },
  })

export { deleteRecipeOptions }
