import { getDb } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { getFileUrl } from '@/lib/r2'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

const getAllRecipes = createServerFn({
  method: 'GET',
  response: 'data',
}).handler(async () => {
  const allRecipes = await getDb().select().from(recipes)

  return allRecipes.map((recipe) => ({
    ...recipe,
    image: getFileUrl(recipe.image),
  }))
})

const getAllRecipesQueryOptions = () =>
  queryOptions({
    queryKey: ['recipes'],
    queryFn: () => getAllRecipes(),
  })

export { getAllRecipes, getAllRecipesQueryOptions }
