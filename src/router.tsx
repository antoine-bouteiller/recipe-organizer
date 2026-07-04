import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as v from 'valibot'

import { DefaultErrorComponent } from '@/components/error/default-error-component'
import { NotFound } from '@/components/error/not-found'

import '@valibot/i18n/fr'

import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

const MAX_AGE = 1000 * 60 * 60 * 24 // 24 hours

v.setGlobalConfig({ lang: 'fr' })

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
    defaultViewTransition: {
      types: ({ fromLocation, toLocation }) => {
        const fromIndex = fromLocation?.state.__TSR_index ?? 0
        const toIndex = toLocation.state.__TSR_index ?? 0

        return toIndex < fromIndex ? ['back'] : false
      },
    },
    notFoundMode: 'root',
    routeTree,
  })

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  })

  return router
}
