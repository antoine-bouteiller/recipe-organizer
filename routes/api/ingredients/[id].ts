import { eq } from 'drizzle-orm'
import { defineHandler } from 'void'
import * as z from 'zod'

import { ingredient } from '@/db/schema'
import { ingredientSchema } from '@/features/ingredients/schemas'
import { withAuthGuard } from '@/lib/server/auth/auth-guard'
import { getDb } from '@/lib/server/db'

const ingredientIdParamsSchema = z.object({ id: z.coerce.number() })

export const PUT = withAuthGuard(
  defineHandler.withValidator({ body: ingredientSchema.partial().pipe(ingredientSchema), params: ingredientIdParamsSchema })(
    async (_context, { body, params }) => {
      await getDb().update(ingredient).set(body).where(eq(ingredient.id, params.id))
    }
  )
)

export const DELETE = withAuthGuard(
  defineHandler.withValidator({ params: ingredientIdParamsSchema })(async (_context, { params }) => {
    await getDb().delete(ingredient).where(eq(ingredient.id, params.id))
  }),
  'admin'
)
