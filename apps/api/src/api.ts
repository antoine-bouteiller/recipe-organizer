import { type ApiEnvironment } from '@recipe-organizer/api/api-context'
import { getApiUser } from '@recipe-organizer/api/lib/auth/api-user'
import { ingredientRoutes } from '@recipe-organizer/api/routes/ingredients/routes'
import { recipeRoutes } from '@recipe-organizer/api/routes/recipe/routes'
import { shoppingListRoutes } from '@recipe-organizer/api/routes/shopping-list/routes'
import { userRoutes } from '@recipe-organizer/api/routes/users/routes'
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { HTTPException } from 'hono/http-exception'
import * as z from 'zod'

// Services are supplied per request; the app never retains a database or session.
export const api = new Hono<ApiEnvironment>()
  .basePath('/api')
  .get('/health', (context) => context.json({ status: 'ok' }))
  .on(['GET', 'POST'], '/auth/*', (context) => context.env.auth.handler(context.req.raw))
  .use(csrf())
  .get('/image/:id', (context) => context.env.media.createR2GetHandler('image/webp')({ params: context.req.param(), request: context.req.raw }))
  .get('/video/:id', (context) => {
    // Hono dispatches HEAD through GET handlers while preserving the original method.
    const createHandler = context.req.method === 'HEAD' ? context.env.media.createR2HeadHandler : context.env.media.createR2GetHandler
    return createHandler('video/mp4')({ params: context.req.param(), request: context.req.raw })
  })
  .get('/session', async (context) => context.json((await getApiUser(context)) ?? null))
  .route('/ingredients', ingredientRoutes)
  .route('/recipes', recipeRoutes)
  .route('/shopping-list', shoppingListRoutes)
  .route('/users', userRoutes)
  .notFound((context) => context.json({ error: 'not_found' }, 404))
  .onError((error, context) => {
    if (error instanceof HTTPException) {
      return context.json({ error: error.message || 'Une erreur est survenue' }, error.status)
    }
    if (error instanceof z.ZodError) {
      return context.json({ error: `Invalid Schema; ${z.prettifyError(error)}` }, 400)
    }
    // oxlint-disable-next-line no-console -- Keep server diagnostics out of the HTTP response.
    console.error(error)
    return context.json({ error: 'Une erreur est survenue' }, 500)
  })
