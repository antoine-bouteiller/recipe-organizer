import { queryOptions } from '@tanstack/solid-query'
import { createServerFn } from '@tanstack/solid-start'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { type ReducedRecipe } from '@/types/recipe'
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

    return rows.map(
      (row): ReducedRecipe => ({
        cuisineTypes: row.cuisineTypes ?? [],
        id: row.id,
        image: getImageUrl(row.image),
        isMagimix: row.isMagimix,
        isSpice: row.isSpice,
        isVegetarian: row.isVegetarian,
        meals: row.meals ?? [],
        name: row.name,
        servings: row.servings,
      })
    )
  })
)

export const getRecipeListOptions = () =>
  queryOptions({
    queryFn: getAllRecipes,
    queryKey: queryKeys.recipeList(),
  })
