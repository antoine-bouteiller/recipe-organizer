import { getDb } from '@/lib/db'
import { recipe } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { withServerErrorCapture } from '@/utils/error-handler'
import { getFileUrl } from '@/utils/get-file-url'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc, like, sql } from 'drizzle-orm'
import { z } from 'zod'

const getAllRecipesSchema = z.object({
  search: z.string().optional(),
})

const getAllRecipes = createServerFn({
  method: 'GET',
})
  .inputValidator(getAllRecipesSchema)
  .handler(
    withServerErrorCapture(async ({ data }) =>
      getDb()
        .select({
          id: recipe.id,
          name: recipe.name,
          image: sql`${recipe.image}`.mapWith(getFileUrl),
          quantity: recipe.quantity,
        })
        .from(recipe)
        .orderBy(asc(recipe.name))
        .where(data.search ? like(recipe.name, `%${data.search}%`) : undefined)
    )
  )

const getRecipeListOptions = (search?: string) =>
  queryOptions({
    queryKey: queryKeys.recipeList(search),
    queryFn: () => getAllRecipes({ data: { search } }),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]

export { getAllRecipes, getRecipeListOptions }
