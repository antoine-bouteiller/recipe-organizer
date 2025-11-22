// src/router.tsx
import { DefaultErrorComponent } from '@/components/error/default-error-component'
import { NotFound } from '@/components/error/not-found'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

export const getRouter = () => {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    notFoundMode: 'root',
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: NotFound,
    defaultPreload: 'intent',
    context: {
      queryClient,
      authUser: undefined,
      theme: 'light' as const,
    },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
