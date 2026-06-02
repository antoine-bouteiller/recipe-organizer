import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { db } from 'void/db'

import { queryKeys } from '@/lib/query-keys'

const getIngredientsList = createServerFn({
  method: 'GET',
}).handler(() =>
  db.query.ingredient.findMany({
    orderBy: (fields, { asc }) => asc(fields.name),
  })
)

const getIngredientListOptions = () =>
  queryOptions({
    queryFn: getIngredientsList,
    queryKey: queryKeys.listIngredients(),
  })

export { getIngredientListOptions }
