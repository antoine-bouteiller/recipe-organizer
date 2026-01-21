import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'
import { eq, inArray } from 'drizzle-orm'

import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { groupIngredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { deleteFile } from '@/lib/r2'
import { withServerError } from '@/utils/error-handler'

const deleteRecipeSchema = type('number')

const deleteRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard('admin')])
  .inputValidator(deleteRecipeSchema)
  .handler(
    withServerError(async ({ data: id }) => {
      const currentRecipe = await getDb().query.recipe.findFirst({
        where: {
          id,
        },
        columns: {
          id: true,
          image: true,
        },
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

      await getDb().batch([
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
        getDb().delete(recipe).where(eq(recipe.id, id)),
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
