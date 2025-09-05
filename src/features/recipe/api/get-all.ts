import { getDb } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { getFileUrl } from '@/lib/r2'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { like } from 'drizzle-orm'
import z from 'zod'

const getAllRecipes = createServerFn({
  method: 'GET',
  response: 'data',
})
  .validator(
    z.object({
      search: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const allRecipes = await getDb()
      .select()
      .from(recipes)
      .where(like(recipes.name, `%${data.search}%`))

    return allRecipes.map((recipe) => ({
      ...recipe,
      image: getFileUrl(recipe.image),
    }))
  })

const getAllRecipesQueryOptions = (search?: string) =>
  queryOptions({
    queryKey: ['recipes', search],
    queryFn: () => getAllRecipes({ data: { search } }),
  })

export { getAllRecipes, getAllRecipesQueryOptions }
