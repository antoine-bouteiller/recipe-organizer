import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { db } from 'void/db'

import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'
import { getImageUrl } from '@/utils/get-file-url'

const getAllRecipes = createServerFn({
  method: 'GET',
}).handler(
  withServerError(async () => {
    const rows = await db.query.recipe.findMany({
      columns: {
        id: true,
        image: true,
        name: true,
        servings: true,
        tags: true,
      },
      orderBy: (fields, { asc }) => asc(fields.name),
    })

    return rows.map((row) => ({
      id: row.id,
      image: getImageUrl(row.image),
      name: row.name,
      servings: row.servings,
      tags: row.tags ?? [],
    }))
  })
)

export const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]
