import { authGuard } from '@/features/auth/lib/auth-guard'
import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { withServerErrorCapture } from '@/lib/error-handler'
import { deleteFile } from '@/lib/r2'
import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { recipesQueryKeys } from './query-keys'

const deleteRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard('admin')])
  .inputValidator(z.number())
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const deletedRecipe = await getDb().delete(recipe).where(eq(recipe.id, data)).returning()
      await deleteFile(deletedRecipe[0].image)
    })
  )

const deleteRecipeOptions = () =>
  mutationOptions({
    mutationFn: deleteRecipe,
    onSuccess: (_data, _variables, _result, context) => {
      void context.client.invalidateQueries({ queryKey: recipesQueryKeys.all })
    },
  })

export { deleteRecipeOptions }
