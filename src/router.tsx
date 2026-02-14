import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { DefaultErrorComponent } from '@/components/error/default-error-component'
import { NotFound } from '@/components/error/not-found'

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

  if (globalThis.localStorage !== undefined) {
    const persister = createAsyncStoragePersister({
      storage: globalThis.localStorage,
    })

    void persistQueryClient({
      queryClient,
      persister,
      maxAge: MAX_AGE,
    })
  }

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
