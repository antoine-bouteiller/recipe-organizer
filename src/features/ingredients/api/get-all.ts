import { getDb } from '@/lib/db'
import { ingredients } from '@/lib/db/schema'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'

const getAllIngredients = createServerFn({
  method: 'GET',
}).handler(() => getDb().select().from(ingredients).orderBy(asc(ingredients.name)))

const getAllIngredientsQueryOptions = () =>
  queryOptions({
    queryKey: ['ingredients'],
    queryFn: () => getAllIngredients(),
  })

export { getAllIngredients, getAllIngredientsQueryOptions }
