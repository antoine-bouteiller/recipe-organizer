import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'
import { getFileUrl } from '@/utils/get-file-url'

const getAllRecipes = createServerFn({
  method: 'GET',
}).handler(
  withServerError(async () => {
    const rows = await getDb().query.recipe.findMany({
      orderBy: {
        name: 'asc',
      },
      columns: {
        id: true,
        name: true,
        image: true,
        servings: true,
        isVegetarian: true,
        isMagimix: true,
      },
    })

    return rows.map((row) => ({
      id: row.id,
      image: getFileUrl(row.image),
      isMagimix: row.isMagimix,
      isVegetarian: row.isVegetarian,
      name: row.name,
      servings: row.servings,
    }))
  })
)

const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]

export { getAllRecipes, getRecipeListOptions }
