import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import { db } from 'void/db'

import { queryKeys } from '@/lib/query-keys'
import { withServerError } from '@/utils/error-handler'

const getRecipeInstructionsSchema = v.number()

const getRecipeInstructions = createServerFn({
  method: 'GET',
})
  .inputValidator(getRecipeInstructionsSchema)
  .handler(
    withServerError(async ({ data }) => {
      const result = await db.query.recipe.findFirst({
        columns: { id: true, instructions: true, name: true },
        where: (fields, { eq }) => eq(fields.id, data),
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

export { getRecipeInstructionsOptions }
