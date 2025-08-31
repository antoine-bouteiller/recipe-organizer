import { getDb } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { deleteFile } from '@/lib/r2'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const deleteRecipe = createServerFn({
  method: 'POST',
  response: 'data',
})
  .validator(z.number())
  .handler(async ({ data }) => {
    const deletedRecipe = await getDb().delete(recipes).where(eq(recipes.id, data)).returning()
    await deleteFile(deletedRecipe[0].image)
  })
