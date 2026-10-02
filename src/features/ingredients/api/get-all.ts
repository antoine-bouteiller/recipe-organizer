import { readResponse } from '@client/lib/api-client'
import { queryKeys } from '@client/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'
import { fetch } from 'void/client'

const getIngredientListOptions = () =>
  queryOptions({
    queryFn: () => readResponse(fetch('/api/ingredients')),
    queryKey: queryKeys.listIngredients(),
  })

export { getIngredientListOptions }
