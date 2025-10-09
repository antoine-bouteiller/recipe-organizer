import { authGuard } from '@/features/auth/auth-guard'
import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { withServerErrorCapture } from '@/lib/error-handler'
import { deleteFile } from '@/lib/r2'
import { useMutation } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

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

const useDeleteRecipeMutation = () =>
  useMutation({
    mutationFn: deleteRecipe,
  })

export { useDeleteRecipeMutation }
