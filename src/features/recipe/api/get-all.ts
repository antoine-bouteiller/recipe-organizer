import { getDb } from '@/lib/db'
import { withServerErrorCapture } from '@/lib/error-handler'
import { getFileUrl } from '@/lib/r2'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
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
  .handler(
    withServerErrorCapture(async ({ data }) => {
      const allRecipes = await getDb().recipe.findMany({
        where: {
          name: {
            contains: data.search,
          },
        },
      })

      return allRecipes.map((recipe) => ({
        ...recipe,
        image: getFileUrl(recipe.image),
      }))
    })
  )

const getAllRecipesQueryOptions = (search?: string) =>
  queryOptions({
    queryKey: ['recipes', search],
    queryFn: () => getAllRecipes({ data: { search } }),
  })

export { getAllRecipes, getAllRecipesQueryOptions }
