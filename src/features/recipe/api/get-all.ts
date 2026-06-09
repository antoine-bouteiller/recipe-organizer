import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'
import { getImageUrl } from '@/utils/get-file-url'

const getAllRecipes = createServerFn({
  method: 'GET',
}).handler(
  withServerError(async () => {
    const rows = await getDb().query.recipe.findMany({
      columns: {
        cuisineTypes: true,
        id: true,
        image: true,
        isMagimix: true,
        isSpice: true,
        isVegetarian: true,
        meals: true,
        name: true,
        servings: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return rows.map((row) => ({
      cuisineTypes: row.cuisineTypes ?? [],
      id: row.id,
      image: getImageUrl(row.image),
      isMagimix: row.isMagimix,
      isSpice: row.isSpice,
      isVegetarian: row.isVegetarian,
      meals: row.meals ?? [],
      name: row.name,
      servings: row.servings,
    }))
  })
)

export const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })

export type ReducedRecipe = Awaited<ReturnType<typeof getAllRecipes>>[number]
