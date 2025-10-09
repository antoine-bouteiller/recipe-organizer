import { getDb } from '@/lib/db'
import { ingredient } from '@/lib/db/schema'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'

const getAllIngredients = createServerFn({
  method: 'GET',
}).handler(() =>
  getDb().query.ingredient.findMany({
    orderBy: asc(ingredient.name),
  })
)

const getAllIngredientsQueryOptions = queryOptions({
  queryKey: ['ingredients'],
  queryFn: getAllIngredients,
})

const useGetAllIngredients = () => useQuery(getAllIngredientsQueryOptions)

export { getAllIngredients, getAllIngredientsQueryOptions, useGetAllIngredients }
