import { Button } from '@recipe-organizer/design-system/button'
import { NotFound } from '@recipe-organizer/design-system/not-found'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, isRedirect, Link } from '@tanstack/react-router'
import * as z from 'zod'

import { routeTree } from './routeTree.gen'

import * as styles from './router.css'

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
    defaultErrorComponent: ({ error }) => {
      const details = import.meta.env.DEV && error instanceof Error ? error.message : undefined

      return (
        <div className={styles.root} role="alert">
          <h1 className={styles.heading}>Whoops!</h1>
          <div className={styles.body}>
            <h2 className={styles.subheading}>Une erreur est survenue</h2>
            <p>Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.</p>
          </div>
          {details && (
            <div className={styles.details}>
              <code>{details}</code>
            </div>
          )}
          <Button render={<Link to="/" />} size="lg">
            Retour à la page d'accueil
          </Button>
        </div>
      )
    },
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
