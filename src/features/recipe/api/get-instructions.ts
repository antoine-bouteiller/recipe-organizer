import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { type } from 'arktype'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

const getRecipeInstructionsSchema = type('number')

const getRecipeInstructions = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipeInstructionsSchema)
  .handler(
    withServerError(async ({ data }) => {
      const result = await getDb().query.recipe.findFirst({
        columns: { id: true, instructions: true, name: true },
        where: { id: data },
      })

      return result ?? undefined
    })
  )

const getRecipeInstructionsOptions = (id: number) =>
  queryOptions({
    queryFn: () => getRecipeInstructions({ data: id }),
    queryKey: queryKeys.recipeInstructions(id),
    staleTime: 5 * 60 * 1000,
  })

export { getRecipeInstructions, getRecipeInstructionsOptions }
