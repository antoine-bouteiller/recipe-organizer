import { defineMiddleware } from 'void'

declare global {
  interface VoidGeneratedEnvBindings {
    readonly ASSETS: Fetcher
  }
}

// Void's own worker-side SPA fallback is lost when Vanilla Extract re-evaluates vite.config.ts and regenerates .void/entry.ts.
export default defineMiddleware(async (context, next) => {
  await next()
  const { method, path } = context.req
  const isDocumentMiss =
    context.res.status === 404 &&
    (method === 'GET' || method === 'HEAD') &&
    path !== '/api' &&
    !path.startsWith('/api/') &&
    !/\.[^/]+$/u.test(path) &&
    context.req.header('accept')?.includes('text/html')
  if (!isDocumentMiss) {
    return
  }
  const index = await context.env.ASSETS.fetch(new Request(new URL('/index.html', context.req.url), { method }))
  if (index.ok) {
    context.res = index
  }
})
