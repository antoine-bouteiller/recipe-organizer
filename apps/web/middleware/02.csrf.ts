import { csrf } from 'hono/csrf'
import { defineMiddleware } from 'void'

const protect = csrf()

// Better Auth applies its own origin checks.
export default defineMiddleware((context, next) =>
  context.req.path.startsWith('/api/') && !context.req.path.startsWith('/api/auth/') ? protect(context, next) : next()
)
