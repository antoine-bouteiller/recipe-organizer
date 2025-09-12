import { getDb } from '@/lib/db'
import { deleteFile } from '@/lib/r2'
import { mutationOptions } from '@tanstack/react-query'
import { withServerErrorCapture } from '@/lib/error-handler'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const deleteRecipe = createServerFn({
  method: 'POST',
  response: 'data',
})
  .validator(z.number())
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const deletedRecipe = await getDb().recipe.delete({
        where: {
          id: data,
        },
      })
      await deleteFile(deletedRecipe.image)
    })
  )

const deleteRecipeMutationQueryOptions = mutationOptions({
  mutationFn: deleteRecipe,
})

export { deleteRecipeMutationQueryOptions }
