import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { DefaultErrorComponent } from '@/components/error/default-error-component'
import { NotFound } from '@/components/error/not-found'

import '@/utils/zod-fr'
import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

const MAX_AGE = 1000 * 60 * 60 * 24 // 24 hours

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: MAX_AGE,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  })

  const router = createRouter({
    context: {
      authUser: undefined,
      queryClient,
      theme: 'light' as const,
    },
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: NotFound,
    defaultPreload: 'intent',
    notFoundMode: 'root',
    routeTree,
  })

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  })

  return router
}
