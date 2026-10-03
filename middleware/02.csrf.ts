import { defineMiddleware } from 'void'

import { HttpError } from '@/lib/server/http-error'

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS'])
const formContentType = /^\b(?:application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)\b/iu

// Better Auth applies its own origin checks.
export default defineMiddleware(async (context, next) => {
  const { method, path, url } = context.req
  const isProtected =
    path.startsWith('/api/') &&
    !path.startsWith('/api/auth/') &&
    !safeMethods.has(method) &&
    formContentType.test(context.req.header('content-type') ?? 'text/plain')
  if (isProtected && context.req.header('sec-fetch-site') !== 'same-origin' && context.req.header('origin') !== new URL(url).origin) {
    throw new HttpError(403)
  }
  await next()
})
