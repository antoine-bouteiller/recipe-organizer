import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'

const getIngredientsList = createServerFn({
  method: 'GET',
}).handler(() =>
  getDb().query.ingredient.findMany({
    orderBy: {
      name: 'asc',
    },
  })
)

const getIngredientListOptions = () =>
  queryOptions({
    queryFn: getIngredientsList,
    queryKey: queryKeys.listIngredients(),
  })

export { getIngredientListOptions, getIngredientsList }
