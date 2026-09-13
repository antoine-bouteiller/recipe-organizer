import { DefaultErrorComponent } from '@client/components/error/default-error-component'
import { NotFound } from '@client/components/error/not-found'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, isRedirect } from '@tanstack/react-router'
import * as z from 'zod'

import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

const MAX_AGE = 1000 * 60 * 60 * 24 // 24 hours

z.config(z.locales.fr())

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
    Wrap: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    context: {
      authUser: undefined,
      queryClient,
      theme: 'light' as const,
    },
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: NotFound,
    defaultPendingMs: 100,
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
    scrollToTopSelectors: ['[data-scroll-restoration-id="screen-outer"]', '[data-scroll-restoration-id="screen-inner"]'],
  })

  const handleQueryError = (error: unknown) => {
    if (isRedirect(error)) {
      error.options._fromLocation = router.stores.location.get()
      return router.navigate(router.resolveRedirect(error).options)
    }
    return undefined
  }

  queryClient.getQueryCache().config.onError = handleQueryError
  queryClient.getMutationCache().config.onError = handleQueryError

  return router
}
