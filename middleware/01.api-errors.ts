import { defineMiddleware } from 'void'

import { toApiErrorResponse, toApiValidationResponse } from '@/lib/server/api-error'

const isApiPath = (path: string) => path === '/api' || path.startsWith('/api/')

const readJson = (response: Response): Promise<unknown> =>
  response
    .clone()
    .json()
    .catch(() => undefined)

export default defineMiddleware(async (context, next) => {
  await next()
  const isApi = isApiPath(context.req.path)
  // Page actions share the JSON error body so `action()` callers can surface the message.
  if (context.error && (isApi || context.req.method !== 'GET')) {
    context.res = toApiErrorResponse(context.error)
    return
  }
  if (!isApi) {
    return
  }
  // Void's fallback for unmatched API paths is a text 404.
  if (context.res.status === 404 && context.res.headers.get('content-type')?.startsWith('text/plain')) {
    context.res = Response.json({ error: 'not_found' }, { status: 404 })
    return
  }
  if (context.res.status === 400) {
    context.res = toApiValidationResponse(await readJson(context.res)) ?? context.res
  }
})
