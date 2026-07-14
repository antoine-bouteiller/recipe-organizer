import { QueryClient } from '@tanstack/solid-query'
import { createRouter } from '@tanstack/solid-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/solid-router-ssr-query'
import * as v from 'valibot'

import { DefaultErrorComponent } from '@/components/error/default-error-component'
import { NotFound } from '@/components/error/not-found'

import '@valibot/i18n/fr'

import { routeTree } from './routeTree.gen'

declare module '@tanstack/solid-router' {
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
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  })

  return router
}
