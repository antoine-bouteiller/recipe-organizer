import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'

const getIngredientsList = createServerFn({
  method: 'GET',
}).handler(() => getDb().select().from(ingredient).orderBy(asc(ingredient.name)))

const getIngredientListOptions = () =>
  queryOptions({
    queryFn: getIngredientsList,
    queryKey: queryKeys.listIngredients(),
  })

export { getIngredientListOptions, getIngredientsList }
