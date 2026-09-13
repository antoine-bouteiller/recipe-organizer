import { zValidator } from '@hono/zod-validator'
import { user } from '@schema'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { type ApiEnvironment } from '@/lib/api-context'
import { authGuard } from '@/lib/auth/auth-guard'

import { getUsersListSchema, userIdSchema, userSchema } from './schemas'

export const userRoutes = new Hono<ApiEnvironment>()
  .get('/', authGuard('admin'), zValidator('query', getUsersListSchema), async (context) => {
    const { status } = context.req.valid('query')
    const users = await context.env.db.query.user.findMany({
      orderBy: { email: 'asc' },
      where: { status },
    })
    return context.json(users)
  })
  .post('/', authGuard('admin'), zValidator('json', userSchema), async (context) => {
    const data = context.req.valid('json')
    await context.env.db.insert(user).values({ ...data, id: crypto.randomUUID(), name: data.email })
    return context.body(null, 204)
  })
  .post('/approve', authGuard('admin'), zValidator('json', userIdSchema), async (context) => {
    const { id } = context.req.valid('json')
    await context.env.db.update(user).set({ status: 'active' }).where(eq(user.id, id))
    return context.body(null, 204)
  })
  .post('/block', authGuard('admin'), zValidator('json', userIdSchema), async (context) => {
    const { id } = context.req.valid('json')
    await context.env.db.update(user).set({ status: 'blocked' }).where(eq(user.id, id))
    return context.body(null, 204)
  })
