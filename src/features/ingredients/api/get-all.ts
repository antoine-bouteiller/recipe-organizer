import { getDb } from '@/lib/db'
import { withServerErrorCapture } from '@/lib/error-handler'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

const getAllIngredients = createServerFn({
  method: 'GET',
}).handler(
  withServerErrorCapture(() =>
    getDb().ingredient.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  )
)

const getAllIngredientsQueryOptions = () =>
  queryOptions({
    queryKey: ['ingredients'],
    queryFn: getAllIngredients,
  })

export { getAllIngredients, getAllIngredientsQueryOptions }
