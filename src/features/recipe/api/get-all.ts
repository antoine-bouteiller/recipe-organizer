import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { getImageUrl } from '@/utils/get-file-url'

const getAllRecipes = createServerFn({
  method: 'GET',
}).handler(async () => {
  const rows = await getDb().query.recipe.findMany({
    orderBy: {
      name: 'asc',
    },
    columns: {
      id: true,
      name: true,
      image: true,
      servings: true,
      tags: true,
    },
  })

  return rows.map((row) => ({
    id: row.id,
    image: getImageUrl(row.image),
    name: row.name,
    servings: row.servings,
    tags: row.tags ?? [],
  }))
})

const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]

export { getAllRecipes, getRecipeListOptions }
