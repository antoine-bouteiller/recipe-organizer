import { zValidator } from '@hono/zod-validator'
import type { ApiEnvironment } from '@recipe-organizer/api/api-context'
import { authGuard } from '@recipe-organizer/api/lib/auth/auth-guard'
import { ingredient } from '@recipe-organizer/api/schema'
import { deleteIngredientSchema, ingredientSchema, updateIngredientSchema } from '@recipe-organizer/shared/ingredients/schemas'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

export const ingredientRoutes = new Hono<ApiEnvironment>()
  .get('/', async (context) => {
    const ingredients = await context.env.db.query.ingredient.findMany({
      orderBy: { name: 'asc' },
    })
    return context.json(ingredients)
  })
  .post('/', authGuard(), zValidator('json', ingredientSchema), async (context) => {
    await context.env.db.insert(ingredient).values(context.req.valid('json'))
    return context.body(null, 204)
  })
  .post('/update', authGuard(), zValidator('json', updateIngredientSchema), async (context) => {
    const { id, ...newIngredient } = context.req.valid('json')
    await context.env.db.update(ingredient).set(newIngredient).where(eq(ingredient.id, id))
    return context.body(null, 204)
  })
  .post('/delete', authGuard('admin'), zValidator('json', deleteIngredientSchema), async (context) => {
    const { id } = context.req.valid('json')
    await context.env.db.delete(ingredient).where(eq(ingredient.id, id))
    return context.body(null, 204)
  })
