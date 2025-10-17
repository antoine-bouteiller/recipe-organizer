// src/router.tsx
import { DefaultErrorComponent } from '@/components/default-error-component'
import { NotFound } from '@/components/not-found'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

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
    context: {
      queryClient,
      authUser: undefined,
    },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
