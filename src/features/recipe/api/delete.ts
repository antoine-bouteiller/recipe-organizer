import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { deleteFile } from '@/lib/r2'
import { mutationOptions } from '@tanstack/react-query'
import { withServerErrorCapture } from '@/lib/error-handler'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { authGuard } from '@/features/auth/auth-guard'

const deleteRecipe = createServerFn({
  method: 'POST',
})
  .middleware([authGuard])
  .inputValidator(z.number())
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const deletedRecipe = await getDb().delete(recipe).where(eq(recipe.id, data)).returning()
      await deleteFile(deletedRecipe[0].image)
    })
  )

const deleteRecipeMutationQueryOptions = mutationOptions({
  mutationFn: deleteRecipe,
})

export { deleteRecipeMutationQueryOptions }
